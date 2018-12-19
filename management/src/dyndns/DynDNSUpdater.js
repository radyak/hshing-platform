"use strict";

const { promisify } = require("util");
const getIP = promisify(require("external-ip")());
const get = require("simple-get");
var cron = require("node-cron");
const SimpleParamCheck = require("../util/SimpleParamCheck");

/**
 * Simple client to update DynDNS domains according to DynDNS protocol.
 * See https://help.dyn.com/remote-access-api/perform-update/
 */
class DynDNSUpdater {
  /**
   *
   * @param {*} config
   */
  constructor(config) {
    this.config = {
      username: config.username,
      password: config.password,
      dynDnsHost: config.dynDnsHost,
      domain: config.domain
    };
    SimpleParamCheck.checkForFalsy(this.config);

    this._previousExternalIP = null;
    this._cron = null;
  }

  updateOnce() {
    getIP()
      .then(EXTERNALIP => {
        if (this._previousExternalIP === EXTERNALIP) {
          console.log(
            `The external IP ${EXTERNALIP} hasn't changed; nothing to do`
          );
          return;
        }

        this._previousExternalIP = EXTERNALIP;
        console.log(`The external IP is now ${EXTERNALIP}`);

        var base64Credentials = Buffer.from(
          `${this.config.username}:${this.config.password}`
        ).toString("base64");

        const URL = `https://${this.config.dynDnsHost}/nic/update?hostname=${
          this.config.domain
        }&myip=${EXTERNALIP}`;

        get(
          {
            url: URL,
            method: "GET",
            headers: {
              "User-Agent": "nodeclient",
              Host: this.config.dynDnsHost,
              Authorization: `Basic ${base64Credentials}`
            }
          },
          function(err, res) {
            if (err) throw err;

            res.setTimeout(10000);

            res.on("data", function(chunk) {
              // TODO: evaluation of chunk's content
              console.log("DynDNS server responded with: " + chunk);
            });
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateCyclic(minutes) {
    if (this._cron != null) {
      throw new Error(
        "A cyclic update is already running, cannot start another one"
      );
    }

    var cronExpression = `*/${minutes} * * * *`;
    cron.validate(cronExpression);

    this._cron = cron.schedule(
      cronExpression,
      () => {
        this.updateOnce();
      },
      {
        scheduled: false
      }
    );
    console.log(`Starting cyclic update every ${minutes} minutes`);
    this._cron.start();
  }

  stopCyclicUpdate() {
    if (this._cron == null) {
      console.warn("Cannot stop cyclic update - non was started");
      return;
    }
    this._cron.destroy();
    this._cron = null;
    console.log(`Cyclic update stopped`);
  }
}

module.exports = DynDNSUpdater;

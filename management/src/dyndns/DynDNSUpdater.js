"use strict";

const { promisify } = require("util");
const getIP = promisify(require("external-ip")());
const get = require("simple-get");
var cron = require("node-cron");
const SimpleParamCheck = require("../util/SimpleParamCheck");

var state = {
  previousExternalIP: null,
  error: null
};

var cronJob = null;

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
  }

  updateOnce() {
    getIP()
      .then(EXTERNALIP => {
        if (state.previousExternalIP === EXTERNALIP) {
          console.log(
            `The external IP ${EXTERNALIP} hasn't changed; nothing to do`
          );
          return;
        }

        console.log(
          `The external IP has changed from ${
            state.previousExternalIP
          } to ${EXTERNALIP}`
        );

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
            if (err) {
              state = {
                previousExternalIP: null,
                error: err
              };
              throw err;
            }

            res.setTimeout(10000);

            res.on("data", function(chunk) {
              // TODO: evaluation of chunk's content
              // API like https://www.npmjs.com/package/ddns-updater or https://www.npmjs.com/package/node-dyndns-client
              console.log("DynDNS server responded with: " + chunk);
              state = {
                previousExternalIP: EXTERNALIP,
                error: null
              };
            });
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateCyclic(minutes) {
    if (cronJob != null) {
      throw new Error(
        "A cyclic update is already running, cannot start another one"
      );
    }

    var cronExpression = `*/${minutes} * * * *`;
    cron.validate(cronExpression);

    cronJob = cron.schedule(
      cronExpression,
      () => {
        this.updateOnce();
      },
      {
        scheduled: false
      }
    );
    // Run first update immediately
    this.updateOnce();
    cronJob.start();
    console.log(`Started cyclic update every ${minutes} minute(s)`);
  }

  stopCyclicUpdate() {
    if (cronJob == null) {
      console.warn("Cannot stop cyclic update - non was started");
      return;
    }
    cronJob.destroy();
    cronJob = null;
    console.log(`Cyclic update stopped`);
  }
}

module.exports = DynDNSUpdater;
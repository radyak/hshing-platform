var chai = require("chai");
var expect = chai.expect;

describe("Try out", function () {
    it("path variable extraction", function () {
        var regex = /\/api\/([a-zA-Z.-]*)\/(.*)/i;
        var match = regex.exec("/api/some-path-var/sub/path/with/api/some-system/containing?param=value");

        expect(match[1]).to.equal("some-path-var");
        expect(match[2]).to.equal("sub/path/with/api/some-system/containing?param=value");
    });
});

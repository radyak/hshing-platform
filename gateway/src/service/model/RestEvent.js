class RestEvent {

    constructor(response, error) {
        this.response = response
        this.finished = false
        this.error = error
    }

    matches(status) {

        var actualStatus = this.response.statusCode + ''
        var actualStatusMatcher = actualStatus.substring(0, 1) + '**'
        var statusMatcher = status + ''

        return statusMatcher === actualStatus || statusMatcher === actualStatusMatcher
    }

    executeIfMathing(status, callback) {
        if (!this.finished && this.matches(status)) {
            callback(this.response, this.error)
            this.finished = true
        }
        return this
    }

    /*
     * On Error (e.g. network failures)
     */
    onGeneralError(callback) {
        if (!this.finished && callback) {
            callback(this.response, this.error)
        }
        return this
    }


    /*
     * Default
     */
    default(callback) {
        if (!this.finished) {
            callback(this.response)
        }
        return this
    }

    /*
     * Status groups
     */
    onSuccess(callback) {
        return this.executeIfMathing('2**', callback)
    }

    onClientError(callback) {
        return this.executeIfMathing('3**', callback)
    }

    onClientError(callback) {
        return this.executeIfMathing('4**', callback)
    }

    onServerError(callback) {
        return this.executeIfMathing('5**', callback)
    }


    /*
     * Detailed Status
     */

    // 200
    onOk(callback) {
        return this.executeIfMathing(200, callback)
    }

    // 204
    onNoContent(callback) {
        return this.executeIfMathing(204, callback)
    }

    // 304
    onNotModified(callback) {
        return this.executeIfMathing(304, callback)
    }

    // 400
    onBadReques(callback) {
        return this.executeIfMathing(400, callback)
    }

    // 400
    onBadReques(callback) {
        return this.executeIfMathing(400, callback)
    }

    // 401
    onUnauthorized(callback) {
        return this.executeIfMathing(401, callback)
    }

    // 403
    onNotAllowed(callback) {
        return this.executeIfMathing(403, callback)
    }

    // 404
    onNotFound(callback) {
        return this.executeIfMathing(404, callback)
    }

    // 500
    onInternalServerError(callback) {
        return this.executeIfMathing(500, callback)
    }

    // 502
    onBadGateway(callback) {
        return this.executeIfMathing(502, callback)
    }

    // 503
    onTemporarilyUnavailable(callback) {
        return this.executeIfMathing(503, callback)
    }

}

module.exports = RestEvent
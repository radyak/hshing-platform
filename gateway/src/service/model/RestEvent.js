
function fallbackCallback(request) {
    throw new Error(`No matching callback or default defined for status ${request.statusCode}`)
}



class RestEvent {

    constructor(request, defaultCallback) {
        this.request = request
        this.defaultCallback = defaultCallback
        this.statusToCallbackMap = {}
    }

    register(status, callback) {
        var statusString = '' + status
        this.statusToCallbackMap[statusString] = callback
        return this
    }

    retrieve(status) {
        var statusString = '' + status
        var callback = this.statusToCallbackMap[statusString]
        if (!callback) {
            statusString = statusString.substring(0, 1) + '**'
            callback = this.statusToCallbackMap[statusString]
        }
        return callback
    }

    process() {
        var status = this.request.statusCode
        var callback = this.retrieve(status) || this.defaultCallback || fallbackCallback
        callback(this.request)
    }

    default(callback) {
        this.defaultCallback = callback
        return this
    }

    /*
     * Status groups
     */
    onSuccess(callback) {
        return this.register('2**', callback)
    }

    onClientError(callback) {
        return this.register('3**', callback)
    }

    onClientError(callback) {
        return this.register('4**', callback)
    }

    onServerErrorError(callback) {
        return this.register('5**', callback)
    }


    /*
     * Detailed Status
     */

    // 200
    onOk(callback) {
        return this.register(200, callback)
    }

    // 204
    onNoContent(callback) {
        return this.register(204, callback)
    }

    // 304
    onNotModified(callback) {
        return this.register(304, callback)
    }

    // 400
    onBadReques(callback) {
        return this.register(400, callback)
    }

    // 400
    onBadReques(callback) {
        return this.register(400, callback)
    }

    // 401
    onUnauthorized(callback) {
        return this.register(401, callback)
    }

    // 403
    onNotAllowed(callback) {
        return this.register(403, callback)
    }

    // 404
    onNotFound(callback) {
        return this.register(404, callback)
    }

    // 500
    onInternalServerError(callback) {
        return this.register(500, callback)
    }

    // 502
    onBadGateway(callback) {
        return this.register(502, callback)
    }

    // 503
    onTemporarilyUnavailable(callback) {
        return this.register(503, callback)
    }

}

module.exports = RestEvent
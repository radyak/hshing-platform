var expect = require('chai').expect
var RestEvent = require('../../../src/service/model/RestEvent')

describe('RestEvent', function () {

    
  it('should evaluate most specific callback', function (done) {
    
    var event = new RestEvent({
        statusCode: 200
    })
    .onOk(() => {
        done()
    })
    .onSuccess(() => {
        done('onSuccessCalled, but onOk defined')
    })
    .default(() => {
        done('default, but onOk defined')
    })

  })

  it('should evaluate most specific general callback if no specific callback is defined', function (done) {
    
    var event = new RestEvent({
        statusCode: 200
    })
    .onSuccess(() => {
        done()
    })
    .default(() => {
        done('default, but onOk defined')
    })

  })

  it('should evaluate default callback if nothing else is defined', function (done) {
    
    var event = new RestEvent({
        statusCode: 200
    })
    .default(() => {
        done()
    })

  })

  it('should ignore previous non-matching callbacks', function (done) {
    
    var event = new RestEvent({
        statusCode: 204
    })
    .onBadGateway(() => {
        done('onBadGateway, but onNoContent defined')
    })
    .onNotFound(() => {
        done('onNotFound, but onNoContent defined')
    })
    .onClientError(() => {
        done('onClientError, but onNoContent defined')
    })
    .onServerError(() => {
        done('onClientError, but onNoContent defined')
    })
    .onNoContent(() => {
        done()
    })
    .onSuccess(() => {
        done('onSuccess, but onNoContent defined')
    })
    .default(() => {
        done('default, but onOk defined')
    })

  })

  it('should ignore all callbacks if error occurred (constructor-defined callback)', function (done) {
    
    var event = new RestEvent({
        statusCode: 204
    }, {
        error: 'Some error message'
    }, () => {
        done()
    })
    .onBadGateway(() => {
        done('onBadGateway, but constructor with error and errorCallback called')
    })
    .onNotFound(() => {
        done('onNotFound, but constructor with error and errorCallback called')
    })
    .onClientError(() => {
        done('onClientError, but constructor with error and errorCallback called')
    })
    .onServerError(() => {
        done('onClientError, but constructor with error and errorCallback called')
    })
    .onNoContent(() => {
        done('onNoContent, but constructor with error and errorCallback called')
    })
    .onSuccess(() => {
        done('onSuccess, but constructor with error and errorCallback called')
    })
    .default(() => {
        done('default, but onOk defined')
    })

  })

  it('should ignore all callbacks if error occurred (method-defined callback)', function (done) {
    
    var event = new RestEvent({
        statusCode: 204
    }, {
        error: 'Some error message'
    })
    .onBadGateway(() => {
        done('onBadGateway, but constructor with error and errorCallback called')
    })
    .onNotFound(() => {
        done('onNotFound, but constructor with error and errorCallback called')
    })
    .onClientError(() => {
        done('onClientError, but constructor with error and errorCallback called')
    })
    .onServerError(() => {
        done('onClientError, but constructor with error and errorCallback called')
    })
    .onGeneralError(() => {
        done()
    })
    .onNoContent(() => {
        done('onNoContent, but constructor with error and errorCallback called')
    })
    .onSuccess(() => {
        done('onSuccess, but constructor with error and errorCallback called')
    })
    .default(() => {
        done('default, but onOk defined')
    })

  })


})

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


})

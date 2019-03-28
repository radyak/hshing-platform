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
    .process()

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
    .process()

  })

  it('should evaluate default callback if nothing else is defined', function (done) {
    
    var event = new RestEvent({
        statusCode: 200
    })
    .default(() => {
        done()
    })
    .process()

  })

  it('should throw error if nothing is defined', function (done) {
    
    try {
        var event = new RestEvent({
            statusCode: 200
        })
        .process()
        done('No error was thrown')
    } catch(e) {
        done()
    }

  })


})

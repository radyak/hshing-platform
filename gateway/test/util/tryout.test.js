var chai = require('chai')
var expect = chai.expect

describe('Try out', function () {

  it('path variable extraction', function () {
    var regex = new RegExp('/api/([a-zA-Z.-]*)/*(.*)', 'i')

    var match = regex.exec('/api/some-path-var/sub/path/with/api/some-system/containing?param=value')
    expect(match[1]).to.equal('some-path-var')
    expect(match[2]).to.equal('sub/path/with/api/some-system/containing?param=value')

    match = regex.exec('/api/mongoclient')
    expect(match[1]).to.equal('mongoclient')
    expect(match[2]).to.equal('')
  })

  it("Using a Promise with async/await that resolves successfully", function(done) {
    
    var testPromise = new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve("works")
        }, 200)
    })

    var asyncFunction = async function() {
      var result = await testPromise
      expect(result).to.equal("works")
      done()
    }

    asyncFunction()
  })

  it("Using a normal function with await works normally", function(done) {
    
    var testFunction = function() {
      return "works"
    }

    var asyncFunction = async function() {
      var result = await testFunction()
      expect(result).to.equal("works")
      done()
    }

    asyncFunction()
  })

})

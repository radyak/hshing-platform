var mongoose = require('mongoose')

const HOST = process.env.MONGO_HOST || 'localhost'
const PORT = process.env.MONGO_PORT || '27017'
const DATABASE = process.env.MONGO_DATABASE || 'auth'

var connectString = `mongodb://${HOST}:${PORT}/${DATABASE}`

module.exports = mongoose
  .connect(connectString, { useNewUrlParser: true })
  .then(
    (res) => {
      console.log(`Successfully connected to ${connectString}`)
      return res
    }, (err) => {
      console.error(`Unable to connected to ${connectString}`, err)
      throw err
    }
  )

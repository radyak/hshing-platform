var mongoose = require('mongoose');
var Schema = mongoose.Schema;


mongoose.model('OAuthUsers', new Schema({
  email: {
    type: String,
    min: [10, "Email is too short"],
    max: [99, "Email is too long"],
    required: [true, "Email is required"],
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  firstname: {
    type: String,
    min: [10, "First name is too short"],
    max: [99, "First name is too long"],
    required: [true, "First name is required"]
  },
  lastname: {
    type: String,
    min: [10, "Last name is too short"],
    max: [99, "Last name is too long"],
    required: [true, "Last name is required"]
  },
  password: {
    type: String,
    min: [10, "Password is too short"],
    max: [99, "Password is too long"],
    required: [true, "Password is required"]
  },
  username: {
    type: String,
    min: [10, "Username is too short"],
    max: [24, "Username is too long"],
    required: [true, "Username is required"]
  }
}));

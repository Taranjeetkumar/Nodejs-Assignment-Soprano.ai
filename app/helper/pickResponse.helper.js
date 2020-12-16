const _ = require('lodash');

exports.pickRegistrationResponse = data => {
  var response = _.pick(data, [
    "name",
    "email",
    "phone",
    "_id",
  ]);
  return response;
}

exports.pickLoginResponse = data => {
  var response = _.pick(data, [
    "_id",
    "role",
    "name",
    "phone",
    "email",
    "isOtpVerified",
  ]);
  return response;
}

exports.pickUserProfileResponseInSocial = data => {
  let response = _.pick(data, [
    "_id",
    "name",
    "newsLetter",
    "email",
    "phone",
    "lastLogin",
    "isGoogle",
    "isFacebook"
  ]);
  return response;
};

exports.pickSocialResponse = data => {
  var response = _.pick(data, [
    "name",
    "email",
    "phone",
    "isGoogle",
    "isFacebook",
    "facebook",
    "google",
    "role"
  ]);
  return response;
};
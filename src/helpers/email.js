'use strict';
module.exports = {
  makeVerificationEmail: (url, firstName, lastName, verificationToken) => {
    return `
      <h3>Thank you for signing up, ${firstName} ${lastName}.</h3>
      <p>Please verify your email by clicking the link below</p>
      <a href="${url}verify?token=${verificationToken}">Verify your email</a>
      <p>This link will expire in 2 hours.</p>
    `;
  },
  resetPasswordEmail: (url, verificationToken) => {
    return `
      <p>You are receiving this because you have requested to reset the password for your account.</p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>Please click to button bellow to reset your password.</p>
      <a href="${url}verify/reset?token=${verificationToken}">Reset your password</a>
      <p>This link will expire in 2 hours.</p>
    `;
  }
};
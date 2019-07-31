module.exports = {
  makeVerificationEmail: (url, firstName, lastName, verificationToken) => {
    return `
      <h3>Thank you for signing up, ${firstName} ${lastName}.</h3>
      <p>Please verify your email by clicking the link below</p>
      <a href="${url}verify?token=${verificationToken}">Verify your email</a>
    `;
  },
  resetPasswordEmail: () => {}
};
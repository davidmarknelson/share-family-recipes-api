module.exports = {
  makeVerificationEmail: (url, email, firstName, lastName, verificationToken) => {
    return `
      <h3>Thank you for signing up, ${firstName} ${lastName}.</h3>
      <p>Please verify your email by clicking the link below</p>
      <a href="${url}verify?email=${email}?token=${verificationToken}">Verify your email</a>
    `;
  },
  resetPasswordEmail: () => {}
}
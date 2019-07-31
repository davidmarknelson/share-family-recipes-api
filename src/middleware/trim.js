module.exports = {
  trimBodyEmail: (req, res, next) => {
    if (req.body.email) {
      req.body.email = req.body.email.trim();
    }
    next();
  }
}
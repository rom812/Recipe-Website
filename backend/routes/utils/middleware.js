function requireLogin(req, res, next) {
  if (!req.session || !req.session.user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next(); // allow the request to proceed
}

module.exports = {
  requireLogin
};

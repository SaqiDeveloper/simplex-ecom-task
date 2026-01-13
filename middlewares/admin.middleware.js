module.exports.isSuperAdmin = (req, res, next) => {
  console.log(req.user)
  if (req.user && req.user.isSuperAdmin) {
    return next();
  } else {
    return res.status(403).json({
      message: "Only Super Admin can perform this action"
    });
  }
};
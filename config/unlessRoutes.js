module.exports = {
  authenticateRoutes: {
    path: [
      { url: "/sign-up", method: "POST" },
      { url: "/login", method: "POST" },
      { url: "/admin/login", method: "POST" },
      { url: "/otp/request", method: "POST" },
      { url: "/otp/verify", method: "POST" },
      // { url: "/^\/api\/v1\/test\/*/", method: "PATCH" },
    ],
  },
};

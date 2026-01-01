const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  // Support: Authorization: Bearer <token>
  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  // Support: x-auth-token
  if (!token && req.headers["x-auth-token"]) {
    token = req.headers["x-auth-token"];
  }

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 IMPORTANT: normalize user object
    req.user = {
      id: decoded.id || decoded._id,   // ✅ FIX
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

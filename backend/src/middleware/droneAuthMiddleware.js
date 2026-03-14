const jwt = require("jsonwebtoken");

const verifyDroneToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Drone token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.DRONE_JWT_SECRET);

    // نتأكد أنه فعلاً توكن درون
    if (decoded.type !== "drone") {
      return res.status(403).json({ error: "Invalid drone token" });
    }

    req.drone = decoded; // نخزن بيانات الدرون في الريكوست
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired drone token" });
  }
};

module.exports = verifyDroneToken;
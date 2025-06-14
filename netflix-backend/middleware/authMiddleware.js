const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    let token = null;
    // 1. Try to get token from Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // 2. Fallback: Try to get token from accessToken cookie
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    if (!token) return res.status(401).json({ error: "No token provided." });

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: "User not found." });

    // 4. Attach user info to request
    req.user = { userId: user.id, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = authenticate;
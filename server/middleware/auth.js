import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication token is required." });
    }

    const token = authHeader.split(" ")[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID AND family ID to the request object
    req.userId = decoded.id;
    req.familyId = decoded.familyId;
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token.", error: error.message });
  }
};

export default auth;
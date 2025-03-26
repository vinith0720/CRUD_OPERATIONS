import jwt from "jsonwebtoken";
export const secret = "secretkey"

const authorization = (req,res,next) => {

    const token = req.headers.authorization
    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
      }
    jwt.verify(token,secret,(err,user)=>{
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
          }
          req.user = user; // Store user data in request
          next();
    });
};

export default authorization;
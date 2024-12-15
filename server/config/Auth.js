import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
    path: "../config/.env"
});

const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies; 
        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                message: "User is not authenticated",
                success: false
            });
        }

        const decode = jwt.verify(token, process.env.TOKEN_SECRET); // No need for 'await' with jwt.verify
        console.log("Decoded token:", decode);
        req.user = decode.id; 
        
        next();
    } catch (error) {
        console.error("Error in isAuthenticated middleware:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export default isAuthenticated;

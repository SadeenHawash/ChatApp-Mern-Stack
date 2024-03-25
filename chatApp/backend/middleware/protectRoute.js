import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"Unathurized, No token provided"});
        }
        //decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error :"Unauthorized, Invalid Token "});
        }

        // called userId because it's "userId" in generateToken 
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.statue(401).json({error: "User Not Found"});
        }
        //current authonticated user
        req.user = user;
        //if the function continue then call the next function "sendMessage"
        // the req will continue until a response is returned and send it inside 
        // "sendMessage" function.
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({error:"Internal server error"});
    }
};

export default protectRoute;
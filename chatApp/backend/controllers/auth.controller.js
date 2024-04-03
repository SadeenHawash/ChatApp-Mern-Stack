import User from "../models/user.model.js";
import BlacklistToken from "../models/blacklist.model.js";
import bycryptjs from 'bcryptjs';
import generateTokenAndSetCookies from "../utils/generateToken.js";

export const signupUser = async (req, res) =>{ 
    try {
        const {fullName, userName, password, confirmPassword, gender} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error: "Passwords don't match"});
        }

        const user = await User.findOne({userName});
        if(user){
            return res.status(400).json({error: "UserName already exsists"});
        }
        //hash password
        const salt = await bycryptjs.genSalt(10);
        const hashedPassword = await bycryptjs.hash(password, salt);
        //https://avatar-placeholder.iran.liara.run

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        const newUser = new User({
            fullName,
            userName,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });
        
        if(newUser){
            //generate jwt token
            generateTokenAndSetCookies(newUser._id, res);
            // save to the database
            await newUser.save();
            res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            userName: newUser.userName,
            profilePic: newUser.profilePic
            });
        }else{
            res.status(400).json({error: "Invalid User Data"});
        }
    } catch (error) {
        console.log("Error in signUp controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const loginUser = async(req, res) =>{
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName });
        console.log('User:', user); // Log the user object

        if (!user) {
            console.log('User not found');
            return res.status(400).json({ error: "Invalid userName or password" });
        }

        const isPasswordCorrect = await bycryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            console.log('Incorrect password');
            return res.status(400).json({ error: "Invalid userName or password" });
        }

        generateTokenAndSetCookies(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.error("Error in Login controller", error); // Log the error
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const revokeToken = async (token) => {
    await BlacklistToken.create({ token });
};

export const logoutUser = async(req, res) =>{
    try {
        // Revoke token
        await revokeToken(req.cookies.jwt);

        // Clear JWT cookie
        res.clearCookie("jwt");
        //res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({error: "Loggedout Successfully"});
    } catch (error) {
        console.log("Error in Logout controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
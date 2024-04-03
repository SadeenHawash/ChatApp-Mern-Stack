import jwt from 'jsonwebtoken';
//import crypto from 'crypto';

// Generate a random secret key
const secretKey = process.env.JWT_SECRET || 'ph3NNpZh8KVMReEGG6EQ3ekIawVIjSUT0zIUWAeiDrs=' //crypto.randomBytes(32).toString('hex');

const generateTokenAndSetCookies = (userId, res) => {
    const token = jwt.sign({userId}, secretKey,{
        expiresIn: '15d'
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //miliseconds
        httpOnly: true, //prevent xss attacks cross-site scriting attacks
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });
};

export default generateTokenAndSetCookies;
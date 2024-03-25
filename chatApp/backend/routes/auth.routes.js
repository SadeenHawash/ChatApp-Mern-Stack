import express from "express";
// the sequence is important !! 
import {signupUser, loginUser, logoutUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

export default router;
import express from "express";
import { getUsersForSidebar } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();
// use protectRoute to ensure that unauthunticated users 
// wont be able to call this func

router.get("/chats", protectRoute,getUsersForSidebar);
export default router;
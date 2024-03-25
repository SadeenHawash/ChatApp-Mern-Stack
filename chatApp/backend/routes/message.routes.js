import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

//get the messagres between the current user and the user of the id
router.get("/:id",protectRoute, getMessages);
router.post("/send/:id",protectRoute, sendMessage);

export default router;
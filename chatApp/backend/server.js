import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";

const app = express();
const PORT = process.env.PORT || 5000 ;

dotenv.config();

app.use(express.json()); // parse incoming req with json payloads (from req body)
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req,res) =>{
//     //root route http://localhost:5000/
//     res.send("Hello World!!");
// });


app.listen(PORT, ()=> {
    connectToMongoDB();
    console.log(`server running on port ${PORT}`);
});
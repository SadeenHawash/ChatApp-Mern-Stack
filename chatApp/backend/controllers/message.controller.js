import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async(req, res) =>{
    //console.log("Message Sent", req.params.id);
    try {
        const {message} = req.body; // getting the message from user
        const {id:receiverId} = req.params; // from params 
        const senderId = req.user._id; //.user because of the "protectRoute" middleware 

        //check if conversation exsists between 2 users
        let conversation = await Conversation.findOne({
            participents: { $all: [senderId,receiverId]},
        });
        // if not exsist, they send messages for 
        //the 1st time 
        if(!conversation){
            conversation = await Conversation.create({
                participents: [senderId,receiverId],
                messages: []
                // array messages by default is empty, then no need to add it
            });
        }
        //craete new message and push it into the conversation 
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });
        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        //save to the database

        //await conversation.save();
        //await newMessage.save();

        // replace the above with this, this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);
        // send it as a response
        res.status(201).json(newMessage);
        
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const getMessages = async(req, res) =>{
    try {
        const {id: userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participents: { $all: [senderId, userToChatId]},
        }).populate("messages");

        if(!conversation) return res.status(200).json([]);
        
        const messages = conversation.messages;
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
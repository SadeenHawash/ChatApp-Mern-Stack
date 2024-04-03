import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_DB_URI|| 'mongodb+srv://user-sadeen:XJD81jibGNdTLugl@cluster0.dx0ldit.mongodb.net/chatApp-db';

const connectToMongoDB = async () =>{
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected To MongoDB");
    } catch (error) {
        console.log("Error Connecting To MongoDB", error.message);
    }
};

export default connectToMongoDB;
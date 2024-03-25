import User from "../models/user.model.js";

export const getUsersForSidebar = async(req, res) =>{
    try {
        const loggedInUser = req.user._id;
        //get all users in the db but not the logged in user
        const allUsers = await User.find({_id: { $ne: loggedInUser}}).select("-password");
        res.status(200).json(allUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar Controller", error.message);
        res.status(500).json({error: "Internal Server Error"})
    }
}


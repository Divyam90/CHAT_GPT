import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt  from "bcryptjs";
import Chat from "../models/chat.js";

// Generate JWT TOken
const generateToken = (id) =>{

    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:'30d'
    })
}  


// API to register User
export const registerUser = async(req,res)=>{
    const {name, email, password } = req.body;

    try {
        const userExists = await User.findOne({email})
c
        if (userExists) {
            return res.json({success:false , message:"User Already Exists"})
        }

        const user = await User.create({name , email , password})

        const token  = generateToken(user._id)
        res.json({success:true , token})
    } catch (error) {
        return res.json({success:false , message:error.message})
    }
}

// API to Login User

export const loginUser = async (req,res) =>{
    const {email , password} = req.body;

    try {
        const user = await User.findOne({email})
        if (user) {
            const isMatched = await bcrypt.compare(password , user.password)

            if (isMatched) {
                const token = generateToken(user._id)
                return res.json({success:true , token})
            }
        }
        return res.json({success:false , message:"Invalid email or password "})
        
    } catch (error) {
        return res.json({success:false , message:error.message})
    }
}

// API to get User data
export const getUser = async(req,res) =>{
    try {
        const user = req.user;
        return res.json({success:true,user})
    } catch (error) {
        
    }
}

// API to get published images
export const getPublishedImages = async (req, res) => {
  try {
    const getPublishedImageMessages = await Chat.aggregate([
      { $unwind: "$message" },
      {
        $match: {
          "message.isImage": true,
          "message.isPublished": true,
        },
      },
      { $sort: { "message.timeStamp": -1 } }, // latest first
      {
        $project: {
          _id: 0,
          imageUrl: "$message.content",
          userName: "$userName",
        },
      },
    ]);

    res.json({ success: true, images: getPublishedImageMessages });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

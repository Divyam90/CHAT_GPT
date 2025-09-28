import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connection.on('connected',()=>console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}/{chatgpt}`);
  } catch {
    console.log(error.message)
  }
};


export default connectDb
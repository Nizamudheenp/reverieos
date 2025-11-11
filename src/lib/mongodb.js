import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB(){
    try {
        const db = await mongoose.connect(MONGODB_URI);
        if(db){
            console.log("mongoDB connected");
        }
    } catch (error) {
        console.log("mongoDB error", error);   
    }
}
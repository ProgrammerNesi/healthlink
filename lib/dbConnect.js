import mongoose from "mongoose";

const connection = { isConnected: false };

async function dbConnect(){
    console.log("MONGODB_URI =", process.env.MONGODB_URI);
    if (connection.isConnected){
        console.log("Already connected to database")
        return
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI||'',{})
        
        connection.isConnected=db.connections[0].readyState
        console.log("Db connected successfully")
        
    }

    catch(error){
        console.log("Database connection failed",error)
        process.exit(1)
    }
}


export default dbConnect
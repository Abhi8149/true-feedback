import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection: ConnectionObject={};

export async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log('Alredy connected to database')
        return
    }

    try {
        const db=await mongoose.connect(process.env.MONGO_URI || '');
        connection.isConnected=db.connections[0].readyState;
    
        console.log('Database connected Securly')   
    } catch (error) {
        console.log('Databse connection failed',error)

        process.exit(1)
    }





  
}
//DB connectivity and lising the server is in the separate file
//2nd Approch

import mongoose from "mongoose";
import { DB_NAME } from '../constants.js';
// connect to constant file and save 

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n  MongooseDB connected  !! DB HOST: ${connectionInstance.connection.host}`);
        // ye prer explaine hai ki ky ho raha ha 
        // connectionInstance basically ek object dega 
        // us me connection ka reference hai 
        // ab hum usme connection ka host or port etc access kar sakte hai 

    } catch (error) {
        console.log("Mongodb connection error", error);
        process.exit(1);
        // isiliye process.exit(1) lagate hai ki error ko rok de 
        // or process ka exit code 1 se ye represent karta hai ki error hai 


    }
}
export default connectDB;
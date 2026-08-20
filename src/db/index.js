/*
  =============================================================================
  📌 FILE: src/db/index.js
  -----------------------------------------------------------------------------
  🎯 PURPOSE / OVERVIEW:
  - Is file me humne Database Connection ka logic ek alag modular function me likha hai (2nd Approach / Professional Approach).
  - separation of concerns: Database connectivity code ko main 'index.js' se alag rakha gaya hai taaki code clean aur maintainable rahe.
  =============================================================================
*/

/*
  📌 IMPORT MONGOOSE:
  - 'mongoose' ek ODM (Object Data Modeling) library hai MongoDB aur Node.js ke liye.
  - Kyu use kiya? Iski madad se hum MongoDB se connect kar sakte hain, Schemas/Models bana sakte hain, aur Data Validation + Queries asani se kar sakte hain.
*/
import mongoose from "mongoose";

/*
  📌 IMPORT DB_NAME:
  - '../constants.js' file se DB_NAME ("SStube") ko import kar rahe hain.
  - Kyu use kiya? URI ke piche database ka naam append karne ke liye.
*/
import { DB_NAME } from '../constants.js';

/*
  📌 connectDB FUNCTION (ASYNCHRONOUS FUNCTION):
  - Kyu `async` use kiya? Database se connect hone me thoda time lagta hai (Network Request / I/O Operation). 
  - Async function se hum `await` keyword ka use kar sakte hain taaki Node.js tab tak ruke jab tak DB connection complete na ho jaye.
*/
const connectDB = async () => {
    /*
      📌 try...catch BLOCK:
      - Kyu use kiya? Database connection fail hone ke bohot se reasons ho sakte hain (e.g., Internet issue, Wrong URI, Database Server down, Invalid Credentials).
      - `try` block me hum connection attempt karte hain. Agar error aata hai toh code crash hone ki jagah seedha `catch` block me chala jata hai jahan hum error ko control ke saath handle kar sakte hain.
    */
    try {
        /*
          📌 mongoose.connect():
          - `process.env.MONGODB_URI`: Environment variable se Secret DB Connection String (MongoDB Atlas ya Local URL) read karta hai.
          - `/${DB_NAME}`: Connection String ke aage Database ka naam attach karta hai taaki bataye ki kis specific DB me connect hona hai.
          - `await`: Wait karta hai jab tak MongoDB se connection establish na ho jaye.
          - `connectionInstance`: `mongoose.connect()` ek response Object return karta hai jisme poore active connection ki details hoti hain.
        */
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        /*
          📌 LOG SUCCESSFUL CONNECTION:
          - `connectionInstance.connection.host`: Connection object me se MongoDB server ka host address (e.g., cluster-url ya localhost) read karke print karta hai.
          - Isse confirm ho jata hai ki hum kis host server se successfully connected hain.
        */
        console.log(`\n  MongooseDB connected  !! DB HOST: ${connectionInstance.connection.host}`);
        // connectionInstance basically ek object dega 
        // us me connection ka reference hai 
        // ab hum usme connection ka host or port etc access kar sakte hai 

    } catch (error) {
        /*
          📌 CATCH ERROR & PROCESS EXIT:
          - `error`: Catch me aaye huye error object ko print karta hai taaki pata chale connection kyu fail hua.
          - `process.exit(1)`: Node.js global 'process' module ka method hai jo current running Node process ko forcibly STOP kar deta hai.
          - Exit code `1`: Code '1' ka matlab hota hai "Exit with Failure/Uncaught Exception" (jabki code '0' ka matlab hota hai Success).
          - Kyu exit kiya? Agar Database hi connect nahi hua toh backend application (API Server) chalne ka koi matlab nahi banta, isliye app ko wahi rokiya gaya hai.
        */
        console.log("Mongodb connection error", error);
        process.exit(1);
    }
}

/*
  📌 EXPORT DEFAULT:
  - Is function ko export kar rahe hain taaki 'src/index.js' (Main Entry Point) me isko import karke call kiya ja sake.
*/
export default connectDB;
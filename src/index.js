
import dotenv from "dotenv";
import connectDB from './db/index.js';
import { app } from "./app.js";


dotenv.config({
  path: "./.env"
});


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log(`MongoDB connection failed`, err)
  })


/*
  =============================================================================
  📌 1ST APPROACH - IIFE (Immediately Invoked Function Expression) [For Learning]:
  -----------------------------------------------------------------------------
  - Neeche commented code me 1st approach dikhaya gaya hai jahan index.js me hi direct DB connect kiya gaya tha.
  - IIFE structure: `(async () => { ... })()` - Yeh function bante hi turant execute ho jata hai.
  - Problem with 1st Approach: High Coupling! Main index.js file bohot messy aur heavy ho jaati hai.
  =============================================================================
*/
//1st Approche - IIFE(Immediately Invoked Function Expression)
/*
import mongoose from "mongoose";
import { DB_Name } from "./constants.js";
import express from "express";
const app = express();

(async () => {
    try {
        await mongoose.connect('${process.env.MONGODN_URI}/${DB_Name}');
        app.on("error", () => {
            console.log("Error", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
})()
*/



/*
  =============================================================================
  📌 FILE: src/index.js  —  IS FILE ME KYA KYA HUA AUR KYU KIYA?
  =============================================================================

  1. import dotenv from "dotenv"
     - dotenv package import kiya jo .env file se environment variables load karta hai.
     - Jaise PORT, MONGODB_URI, CLOUDINARY keys — yeh sab .env me hote hain aur
       dotenv unhe process.env me daal deta hai.

  2. import connectDB from './db/index.js'
     - Hamaara custom database connection function import kiya.
     - DB connection ka logic alag file (db/index.js) me rakha hai — 
       yeh professional aur clean coding practice hai.

  3. dotenv.config({ path: "./.env" })
     - .env file read karke saare variables process.env me load kiye.
     - Yeh line SABSE PEHLE execute honi chahiye taaki baad ke code ko
       process.env.PORT, process.env.MONGODB_URI etc. mile.

  4. connectDB().then(...).catch(...)
     - connectDB() async function hai jo MongoDB se connect karta hai.
     - .then(() => { app.listen(...) })
         => DB connect hone KE BAAD hi server start hota hai.
         => Kyu? Pehle DB connected ho, tabhi server requests accept kare —
            warna bina DB ke requests aayengi aur crash hoga.
     - app.listen(process.env.PORT || 8000, ...)
         => Server .env me diye PORT pe ya default 8000 pe start hota hai.
     - .catch((err) => console.log(...))
         => Agar DB connect nahi hua toh error print karo aur server start mat karo.

  5. Commented Code — 1st Approach (IIFE)
     - Yeh ek purani approach thi jisme DB connection directly is file me tha.
     - Problem: File messy ho jaati thi — DB logic aur server logic ek jagah mix tha.
     - 2nd Approach (current) better hai: DB ko alag file me rakho, yahan sirf call karo.

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh application ka main entry point hai — pehle dotenv se config load hoti hai,
  phir DB connect hoti hai, aur successful connection ke baad hi HTTP server
  specified PORT pe start hota hai.
  =============================================================================
*/

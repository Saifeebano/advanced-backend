/*
  =============================================================================
  📌 FILE: src/index.js
  -----------------------------------------------------------------------------
  🎯 PURPOSE / OVERVIEW:
  - Yeh aapki Express/Node.js Backend Application ka Main Entry Point (Starting File) hai.
  - Yahan par hum Environment Variables load karte hain aur Database Connection ko initialize/call karte hain.
  =============================================================================
*/

// Entry point of the application
// databse connection and server listener

/*
  📌 2ND APPROACH - Asynchronous Modular Connection (Recommended & Professional):
  - Is approach me DB logic ko 'src/db/index.js' me alag rakha gaya hai aur yahan sirf import karke execute kiya jata hai.
*/

// require ('dotenv').config({path: "./env"});

/*
  📌 IMPORT DOTENV & CONNECTDB:
  - `dotenv`: System / Environment Variables (jaise PORT, MONGODB_URI) ko `.env` file se read karne ke liye module.
  - `connectDB`: 'src/db/index.js' se hamara custom MongoDB connection function.
*/
import dotenv from "dotenv";
import connectDB from './db/index.js';

/*
  📌 DOTENV CONFIGURATION:
  - `dotenv.config({ path: "./.env" })`: Is line ko application me SABSE PEHLE execute kiya jata hai.
  - Kyu? Taaki pooray project me kahin bhi `process.env` se variables read karne par undefined na aaye.
*/
dotenv.config({ path: "./.env" });

/*
  📌 EXECUTE DB CONNECTION:
  - `connectDB()` ko call karte hi yeh MongoDB se connect hona start ho jata hai.
*/
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



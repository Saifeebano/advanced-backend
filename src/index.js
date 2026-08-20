// Entry point of the application
// databse connection and server listener

//2nd Approche - Asynchronous Function
// require ('dotenv').config({path: "./env"});
import dotenv from "dotenv";
import connectDB from './db/index.js';

dotenv.config({ path: "./.env" });



connectDB()











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


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
   try {
      if (!localFilePath) return null;

      // Upload the file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
         resource_type: "auto"
      });

      // File uploaded successfully, remove local temporary file
      fs.unlinkSync(localFilePath);
      return response;

   } catch (error) {
      console.error("Cloudinary upload error:", error);
      // Remove the locally saved temporary file if the upload operation failed
      if (fs.existsSync(localFilePath)) {
         fs.unlinkSync(localFilePath);
      }
      return null;
   }
};

export { uploadOnCloudinary };

/*
  =============================================================================
  📌 FILE: src/utils/cloudinary.js  —  IS FILE ME KYA KYA HUA AUR KYU KIYA?
  =============================================================================

  1. import { v2 as cloudinary } from "cloudinary"
     - Cloudinary ka official Node.js SDK import kiya.
     - "v2" version use kiya jo latest aur recommended hai.
     - "as cloudinary" alias diya taaki likhne me asaan ho.

  2. import fs from "fs"
     - Node.js ka built-in File System module import kiya.
     - Iska use local disk pe rakhi temporary file ko delete karne ke liye hoga.

  3. cloudinary.config({ cloud_name, api_key, api_secret })
     - Cloudinary account credentials set kiye jo .env file se aate hain.
     - cloud_name: Aapka Cloudinary account name.
     - api_key: Authentication ke liye public key.
     - api_secret: Authentication ke liye secret key (KABHI bhi frontend me mat dena).
     - Yeh config ek baar ho jaane ke baad saare uploads automatically isi account pe jaate hain.

  4. const uploadOnCloudinary = async (localFilePath) => { ... }
     - Ek async function jo local file path leta hai aur Cloudinary pe upload karta hai.

     a) if (!localFilePath) return null
        - Agar koi path nahi diya toh turant null return karo — unnecessary processing band.

     b) const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" })
        - Actual upload hota hai yahan.
        - resource_type: "auto" — Cloudinary khud detect karta hai ki file image hai, video hai ya kuch aur.
        - Response me uploaded file ka URL aur saari details aati hain.

     c) fs.unlinkSync(localFilePath)
        - Upload successful hone ke baad local temporary file delete kar di.
        - Kyu? Disk space waste nahi karna, temp files saaf rakho.

     d) catch (error) block
        - Agar upload fail ho gaya (network error, wrong credentials, etc.):
        - fs.existsSync(localFilePath) check karke file exist karti hai toh usse bhi delete karo.
        - Kyu? Failed upload ke baad bhi temp file disk par nahi rehni chahiye.
        - null return karo taaki caller ko pata chale ki upload fail hua.

  5. export { uploadOnCloudinary }
     - Function ko named export kiya taaki controllers/middlewares me import karke use kar sakein.

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh utility file Cloudinary se connect karti hai aur kisi bhi local temporary file
  ko Cloudinary pe upload karke uska URL return karti hai, aur baad me local file
  delete kar deti hai — chahe upload succeed ho ya fail.
  =============================================================================
*/

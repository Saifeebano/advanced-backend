import multer from "multer";
import crypto from "crypto";


// multer middleware file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, file.fieldname + '-' + raw.toString('hex'))
    })
  }
})

export const upload = multer({ storage: storage })

/*
  =============================================================================
  📌 FILE: src/middlewares/multer.middleware.js  —  IS FILE ME KYA KYA HUA AUR KYU KIYA?
  =============================================================================

  1. import multer from "multer"
     - Multer ek Node.js middleware hai jo file uploads (multipart/form-data) handle karta hai.
     - Jab user koi image ya file upload karta hai form se, multer usse receive karke
       disk (ya memory) pe save karta hai.

  2. const crypto = require('crypto')
     - Node.js ka built-in crypto module import kiya.
     - Iska use unique random file names generate karne ke liye kiya gaya hai
       taaki same naam ki do files aapas me overwrite na karein.

  3. const storage = multer.diskStorage({ ... })
     - Multer ko bataya ki files ko DISK pe store karo (memory me nahi).
     - DiskStorage ke 2 options hain:

       a) destination: function(req, file, cb)
          - Batata hai ki file KAHAN save hogi.
          - cb(null, "./public/temp") — matlab files "public/temp" folder me jaengi.
          - Yeh temporary location hai; baad me Cloudinary pe upload hone ke baad
            local file delete ho jaati hai.

       b) filename: function(req, file, cb)
          - Batata hai ki file ka NAAM kya hoga disk pe.
          - crypto.randomBytes(16, ...) — 16 random bytes generate karta hai.
          - raw.toString('hex') — unhe hexadecimal string me convert karta hai (32 chars).
          - Final naam: "fieldname-<random_hex_string>" (e.g., "avatar-3f9a1b2c...")
          - Kyu random naam? Taaki naam unique ho aur koi file overwrite na ho.

  4. export const upload = multer({ storage: storage })
     - Multer instance banaya aur storage config ke saath export kiya.
     - Ab routes/controllers me `upload.single("avatar")` ya `upload.fields([...])`
       likh ke file upload karna possible ho jaata hai.

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh middleware file upload handle karta hai — files ko temporarily "public/temp"
  folder me unique random naam se save karta hai jab tak Cloudinary pe upload na ho jaye.
  =============================================================================
*/
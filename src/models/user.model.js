import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model("User", userSchema);

/*
  =============================================================================
  📌 FILE: src/models/user.model.js  —  KYA AUR KYU KIYA?
  =============================================================================

  1. import mongoose, { Schema } from "mongoose"
     - Mongoose import kiya — yeh Node.js ke liye MongoDB ODM (Object Data Modeling) library hai.
     - Schema bhi import kiya — isse hum MongoDB document ka "blueprint" define karte hain.
     - Kyu mongoose? Direct MongoDB driver se zyada convenient hai — Schema validation,
       hooks, methods, type casting sab milta hai automatically.

  2. import jwt from "jsonwebtoken"
     - JWT (JSON Web Token) library import ki.
     - Kyu? User login ke baad ek encrypted token banana hota hai jisme user ki info
       (id, email etc.) hoti hai. Yeh token frontend ko diya jaata hai. Har request me
       yeh token bhejkar user authenticate hota hai bina baar baar DB hit kiye.

  3. import bcrypt from "bcrypt"
     - Bcrypt library import ki — password hashing ke liye.
     - Kyu? Password ko plain text me store karna bahut bada security risk hai.
       Bcrypt password ko ek one-way hash me convert karta hai. Hacker ko DB mila
       bhi toh real password nahi pata chalega.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 SCHEMA: userSchema
  ─────────────────────────────────────────────────────────────────────────────
  - username:
    → unique: true → same username do users ka nahi ho sakta.
    → lowercase: true → automatically lowercase me convert ho jaata hai.
    → index: true → MongoDB is field pe index banata hai — search fast hoti hai.
    → trim: true → leading/trailing spaces automatically hata deta hai.

  - email:
    → unique: true → ek email sirf ek user ka ho sakta hai.
    → lowercase: true → case insensitive comparison ke liye.

  - password:
    → required: [true, "Password is required"] → Custom error message ke saath required.
    → Yahan plain password store hoga briefly — pre("save") hook isse hash kar deta hai.

  - avatar:
    → type: String → Cloudinary pe upload hui image ka URL store hoga yahan.
    → required: true → Avatar mandatory hai.

  - coverImage:
    → Optional hai (required nahi) — isliye koi required nahi diya.

  - watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }]
    → Array of ObjectIds — yeh Video documents ke references hain.
    → ref: "Video" → Mongoose ko pata hai ki yeh Video model se populate karna hai.
    → Kyu? User ne kaunse videos dekhe, uska record yahan rakhte hain (MongoDB Referencing).

  - refreshToken:
    → Optional String — login ke baad generate hua refresh token yahan store hota hai.
    → Logout pe ise undefined kar dete hain.

  - timestamps: true → Mongoose automatically createdAt aur updatedAt fields add karta hai.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 MONGOOSE HOOK: userSchema.pre("save", async function() { ... })
  ─────────────────────────────────────────────────────────────────────────────
  - pre("save") → Yeh "Middleware Hook" hai jo document save hone SE PEHLE run hota hai.
  - if (!this.isModified("password")) return
    → Kyu? Har update pe password dobara hash nahi karna. Sirf tab hash karo jab
      password field actually change hui ho. isModified() check karta hai ki field
      change hui hai ya nahi.
  - bcrypt.hash(this.password, 10) → Password ko hash karta hai, 10 = "salt rounds"
    (jitna zyada, utna zyada secure — par slow bhi hoga).
  - Kyu arrow function nahi? this keyword ka context chahiye tha — arrow functions me
    this apne enclosing scope ka hota hai, regular function me document ka.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 METHOD: userSchema.methods.isPasswordCorrect(password)
  ─────────────────────────────────────────────────────────────────────────────
  - bcrypt.compare(password, this.password) → Plain password aur hashed password compare karta hai.
  - Kyu direct comparison nahi? Hash one-way hota hai — "abc" hash ho jaata hai "xyz123..."
    lekin "xyz123..." se "abc" wapas nahi aa sakta. bcrypt.compare internally same process
    use karke check karta hai ki match hota hai ya nahi.
  - true/false return karta hai.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 METHOD: userSchema.methods.generateAccessToken()
  ─────────────────────────────────────────────────────────────────────────────
  - jwt.sign(payload, secret, options) → JWT token generate karta hai.
  - payload: { _id, email, username, fullName } → User ki info token me pack ki.
  - ACCESS_TOKEN_SECRET → .env se secret key — isse token sign hota hai (tamper-proof).
  - ACCESS_TOKEN_EXPIRY → Token ka expiry time (e.g., "15m" or "1d").
  - Access Token → Short-lived, API calls ke saath bheja jaata hai.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 METHOD: userSchema.methods.generateRefreshToken()
  ─────────────────────────────────────────────────────────────────────────────
  - Sirf _id payload me hai — Refresh token me zyada info nahi rakhte (security).
  - REFRESH_TOKEN_EXPIRY → Long-lived (e.g., "10d" or "30d").
  - Refresh Token → Access token expire hone pe naya access token generate karne ke liye
    use hota hai. DB me store hota hai, logout pe delete ho jaata hai.
  - Dono tokens different secrets se sign hote hain — alag security layers.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 EXPORT: export const User = mongoose.model("User", userSchema)
  ─────────────────────────────────────────────────────────────────────────────
  - "User" → MongoDB me collection ka naam "users" ho jaata hai (automatically lowercase plural).
  - User model ko controllers me import karke User.create(), User.findOne() etc. use karte hain.

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh file User ka Mongoose Schema define karti hai — fields, validations, password
  hashing hook, aur JWT token generate karne ke methods — sab kuch ek jagah.

  📌 INTERVIEW ME POOCHHE JAANE WAALE CONCEPTS:
  → bcrypt kya hai? hash aur compare kaise kaam karta hai?
  → JWT kya hota hai? access token aur refresh token me farak?
  → pre("save") hook kyu use kiya? arrow function kyu nahi?
  → index: true kyu lagate hain? kya fayda hota hai?
  → mongoose.model("User", userSchema) se MongoDB me kya hota hai?
  → watchHistory me ref kya kaam karta hai (Population)?
  =============================================================================
*/
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vedioSchema = new Schema({

    vediofile: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    duration: {
        type: Number, //cloudnary m second mai aaega
        required: true
    },
    view: {
        type: Number,
        default: 0
    },
    ispublished: {
        type: Boolean,
        default: true
    },
    publishAt: {
        type: Date,
        default: Date.now()
    }


}, {
    timestamps: true
})

vedioSchema.plugin(mongooseAggregatePaginate)


export const video = mongoose.model("video", vedioSchema)

/*
  =============================================================================
  📌 FILE: src/models/vedio.model.js  —  KYA AUR KYU KIYA?
  =============================================================================

  1. import mongoose, { Schema } from "mongoose"
     - Mongoose ODM library import kiya — MongoDB ke saath kaam karne ke liye.
     - Schema → Document ka structure/blueprint define karne ke liye.

  2. import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
     - Yeh ek Mongoose plugin hai jo Aggregation queries me Pagination support deta hai.
     - Kyu? Jab bahut saare videos hoon toh sab ek saath load karna slow hoga.
       Pagination se hum thode thode records (page-by-page) laate hain.
     - "Aggregate Paginate" isliye kyunki complex MongoDB Aggregation pipelines
       ke saath bhi paginate kar sakte hain (sirf find() nahi, aggregation bhi).

  ─────────────────────────────────────────────────────────────────────────────
  🔧 SCHEMA: vedioSchema
  ─────────────────────────────────────────────────────────────────────────────
  - vediofile: { type: String, required: true }
    → Cloudinary pe upload hui video ka URL store hoga.
    → required: true → Video file mandatory hai — bina video ke record invalid.

  - thumbnail: { type: String, required: true }
    → Video ka preview image (thumbnail) ka Cloudinary URL.
    → required: true → SEO aur UI ke liye thumbnail zaroori hai.

  - title: { type: String, required: true }
    → Video ka naam/title — har video ka koi na koi title hona chahiye.

  - description: { type: String, required: true }
    → Video ki detailed jankari — YouTube jaisi sites me search me kaam aata hai.

  - owner: { type: Schema.Types.ObjectId, ref: "User" }
    → Yeh User model ka reference hai (MongoDB Referencing / Population).
    → Schema.Types.ObjectId → MongoDB ka unique ID type (12 bytes, 24 hex chars).
    → ref: "User" → Mongoose ko batata hai ki yeh ID "User" collection me hai.
    → Kyu? Directly User object store karne ki jagah sirf ID store karte hain —
      isse data duplication nahi hoti aur User update ho toh Video me bhi reflect hota hai.

  - duration: { type: Number, required: true }
    → Video ki length seconds me — Cloudinary upload response me milti hai.
    → Number type isliye ki seconds me hogi (e.g., 125.4 seconds).

  - view: { type: Number, default: 0 }
    → Video ke total views ka count.
    → default: 0 → Nayi video banate waqt views 0 se start hoti hain.

  - ispublished: { type: Boolean, default: true }
    → Video public hai ya private — true = published (visible).
    → default: true → By default video publish ho jaati hai.

  - publishAt: { type: Date, default: Date.now() }
    → Video kab publish hui — uski timestamp.
    → Date.now() → Current time of schema definition (Note: better hoga Date.now
      bina () ke use karein — warna schema load time pe ek baar run hoga).

  - timestamps: true → Mongoose se automatic createdAt aur updatedAt milta hai.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 PLUGIN: vedioSchema.plugin(mongooseAggregatePaginate)
  ─────────────────────────────────────────────────────────────────────────────
  - Yeh plugin vedioSchema me add kiya gaya hai.
  - Isse Video model me ek extra method mil jaata hai: Video.aggregatePaginate()
  - Kaise use hoga? Jab hum complex aggregation pipeline banayenge (e.g., owner ka naam
    bhi chahiye, views ke hisaab se sort karna hai) toh paginate karke efficient
    query chalayenge.
  - Kyu plugin approach? Har model me manually paginate logic nahi likhna — plugin
    ek baar attach karo, functionality mil jaati hai.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 EXPORT: export const video = mongoose.model("video", vedioSchema)
  ─────────────────────────────────────────────────────────────────────────────
  - "video" → MongoDB me collection ka naam "videos" ho jaata hai.
  - video model controllers me import karke use hoga: video.create(), video.find() etc.

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh file Video ka Mongoose Schema define karti hai — file URL, thumbnail, owner
  reference (Population), views, published status aur aggregate pagination plugin —
  taaki videos efficiently manage aur paginate ho sakein.

  📌 INTERVIEW ME POOCHHE JAANE WAALE CONCEPTS:
  → mongoose-aggregate-paginate-v2 kya hai aur kyu use kiya?
  → Schema.Types.ObjectId aur ref kya karta hai? (Population)
  → default: 0 aur default: Date.now() kab use karte hain?
  → timestamps: true kya automatically add karta hai?
  → Plugin pattern kyu use kiya mongoose me?
  =============================================================================
*/
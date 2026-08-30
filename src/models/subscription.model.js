import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, //one who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // one  to whom subscriber is subscribing
        // i  am subscriber and you are channel owner 
        // if i subscribe to you then you are the channel owner of mine.

        ref: "User"
    }
}, { timestamps: true })

export const Subscription = mongoose.model("Subscription", subscriptionSchema)

/*
  =============================================================================
  📌 FILE: src/models/subscription.model.js  —  KYA AUR KYU KIYA?
  =============================================================================

  1. import mongoose, { Schema } from "mongoose"
     - Mongoose ODM library import kiya — MongoDB ke saath kaam karne ke liye.
     - Schema → Document ka blueprint/structure define karne ke liye.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 SCHEMA: subscriptionSchema
  ─────────────────────────────────────────────────────────────────────────────
  - Yeh schema ek "junction table" ki tarah kaam karta hai (Many-to-Many relationship).
  - Ek user BAHUT saare channels subscribe kar sakta hai.
  - Ek channel ke BAHUT saare subscribers ho sakte hain.
  - Yeh relationship track karne ke liye ek alag collection banaya (Subscription).

  - subscriber: { type: Schema.Types.ObjectId, ref: "User" }
    → Jo user kisi ko subscribe karta hai — woh "subscriber" hai.
    → Schema.Types.ObjectId → MongoDB ka unique 12-byte ID type.
    → ref: "User" → Mongoose ko batata hai ki yeh ID "User" collection me hai.
      Isse baad me .populate("subscriber") se pura User object la sakte hain.

  - channel: { type: Schema.Types.ObjectId, ref: "User" }
    → Jis user ko subscribe kiya gaya — woh "channel" hai.
    → Interesting baat: Dono subscriber aur channel SAME "User" collection ko refer
      karte hain — kyunki YouTube jaisi app me koi bhi user channel bhi ban sakta hai.
    → Example: Mai (subscriber) aapko (channel) subscribe karta hoon toh:
        { subscriber: mera_id, channel: aapka_id }

  - { timestamps: true }
    → Mongoose automatically createdAt aur updatedAt fields add karta hai.
    → createdAt → Yeh bata dega ki subscription kab create hua (kab subscribe kiya).

  ─────────────────────────────────────────────────────────────────────────────
  🔧 DESIGN PATTERN: Why alag collection?
  ─────────────────────────────────────────────────────────────────────────────
  - Alternative approach: User model me hi subscribers ka array rakh dete.
    Lekin yeh BAD design hai kyunki:
    → Array bahut bada ho jaata agar millions of subscribers hoon.
    → MongoDB document size limit (16MB) exceed ho sakti hai.
    → Query karna mushkil ho jaata (kon subscribe karta hai, kis ko subscribe kiya).

  - Alag Subscription collection: Each subscription = ek document.
    → Isse efficient queries ban jaati hain:
      * "Mere subscribers kaun hain?" → { channel: mera_id } se dhundho.
      * "Maine kinhe subscribe kiya?" → { subscriber: mera_id } se dhundho.
      * "Subscriber count?" → Subscription.countDocuments({ channel: channelId }).

  ─────────────────────────────────────────────────────────────────────────────
  🔧 EXPORT: export const Subscription = mongoose.model("Subscription", subscriptionSchema)
  ─────────────────────────────────────────────────────────────────────────────
  - "Subscription" → MongoDB me collection ka naam "subscriptions" ho jaata hai.
  - Controllers me import karke:
    → Subscription.create({ subscriber, channel }) → Subscribe karo.
    → Subscription.findOneAndDelete({ subscriber, channel }) → Unsubscribe karo.
    → Subscription.countDocuments({ channel: channelId }) → Subscriber count.

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh file User aur Channel ke beech Many-to-Many subscription relationship track
  karne ke liye ek junction model define karti hai — har document ek
  (subscriber → channel) pair represent karta hai.

  📌 INTERVIEW ME POOCHHE JAANE WAALE CONCEPTS:
  → Many-to-Many relationship MongoDB me kaise handle karte hain?
  → Subscription model me subscriber aur channel dono User ko kyu refer karte hain?
  → Array me subscribers rakhne ki jagah alag collection kyu banaya? (Design Decision)
  → ref: "User" kya karta hai? populate() se kya hota hai?
  → timestamps: true se kaunsi fields automatically add hoti hain?
  → Subscriber count efficiently kaise nikaalein? (countDocuments vs array.length)
  =============================================================================
*/

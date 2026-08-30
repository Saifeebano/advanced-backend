import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


// verify JWT
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      throw new ApiError(401, "Unauthorized")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if (!user) {
      throw new ApiError(401, "Invalid Access")
    }

    req.user = user    // ab user _id nahi user _id.select() pura user aaega
    next()
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid Access")
  }
})

/*
  =============================================================================
  📌 FILE: src/middlewares/auth.middleware.js  —  KYA AUR KYU KIYA?
  =============================================================================

  1. import { asyncHandler } from "../utils/asyncHandler.js"
     - Async middleware ko wrap karne ke liye — errors automatically next() ko pass honge.

  2. import { ApiError } from "../utils/ApiError.js"
     - Custom error throw karne ke liye — structured error response milega.

  3. import jwt from "jsonwebtoken"
     - JWT token verify karne ke liye.
     - Kyu? Token me jo data encode hua hai use sirf verify karke hi paya ja sakta hai.

  4. import { User } from "../models/user.model.js"
     - Token verify hone ke baad DB se actual user data lene ke liye.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 MIDDLEWARE: verifyJWT (req, res, next)
  ─────────────────────────────────────────────────────────────────────────────
  - Kya hai? Yeh ek "Authentication Guard" hai — secured routes ke pehle run hota hai.
  - Kyu middleware hai? Isliye ki logout jaisi action sirf logged-in user kar sake.
    Route pe laga do: router.route("/logout").post(verifyJWT, logoutUser) — pehle
    verifyJWT chalega, agar sab thik hai tabhi logoutUser chalega.

  - const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    → DO sources se token dhundha:
      a) req.cookies?.accessToken → Agar browser cookie me token hai (web app).
      b) req.header("Authorization")?.replace("Bearer ", "") → Agar Authorization
         header me "Bearer <token>" format me token aaya hai (mobile app / Postman).
    → Optional chaining (?.) → agar cookies ya header exist nahi karta toh crash nahi.
    → replace("Bearer ", "") → Sirf actual token chahiye, "Bearer " prefix nahi.

  - if (!token) throw new ApiError(401, "Unauthorized")
    → Dono jagah token nahi mila toh 401 Unauthorized error do.
    → 401 = Authentication required hai, aapne credentials provide nahi kiye.

  - jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    → Token ka signature verify kiya secret key se.
    → Agar token tamper hua hai ya expired hai toh yeh error throw karega.
    → Agar sab thik hai toh decoded payload return hota hai (jisme _id, email etc. hai).

  - User.findById(decodedToken?._id).select("-password -refreshToken")
    → Token me se user ka _id nikala aur DB se actual user fetch kiya.
    → Kyu DB hit? Token purana ho sakta hai — user delete bhi ho sakta hai.
      DB se verify karna ensure karta hai ki user abhi bhi exist karta hai.
    → .select("-password -refreshToken") → Sensitive data response me nahi aana chahiye.

  - if (!user) throw new ApiError(401, "Invalid Access")
    → Agar token valid hai lekin user DB me nahi mila toh bhi unauthorized.

  - req.user = user
    → Yahan user object request pe attach kar diya.
    → Kyu? Aage wale controllers (logoutUser etc.) ko user ka data chahiye hoga.
      Ab woh req.user se directly le sakte hain — baar baar DB query nahi lagani.

  - next()
    → Middleware ka kaam khatam — agle middleware ya controller ko call karo.
    → Agar next() nahi likha toh request yahan stuck ho jaayegi.

  - catch (error): throw new ApiError(401, error.message || "Invalid Access")
    → jwt.verify fail hone pe ya kisi bhi error pe 401 throw karo.
    → error.message liya — original JWT error message (e.g., "jwt expired").

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh middleware authentication guard hai — request me JWT token dhundhta hai,
  verify karta hai, DB se user dhundhta hai, aur req.user set karke next() 
  se agle controller ko pass karta hai. Bina valid token ke aage nahi jaata.

  📌 INTERVIEW ME POOCHHE JAANE WAALE CONCEPTS:
  → Middleware kya hota hai? next() kyu call karte hain?
  → JWT verify kaise karta hai token ko? (signature verification)
  → Bearer token kya hota hai? Authorization header ka format?
  → req.user me user kyu set kiya? alternative kya tha?
  → httpOnly cookie me token kyu rakha — localStorage kyu nahi? (XSS attack)
  → 401 aur 403 me kya fark hai? (Unauthorized vs Forbidden)
  =============================================================================
*/

import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(
   upload.fields([
      {
         name: "avatar",
         maxCount: 1
      },
      {
         name: "coverImage",
         maxCount: 1
      }
   ]),
   registerUser
)


router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)


export default router

/*

  =============================================================================
  📌 FILE: src/routes/user.routes.js  —  KYA AUR KYU KIYA?
  =============================================================================

  1. import { Router } from "express"
     - Express ka Router constructor import kiya.
     - Yeh humein modular routing banaane me help karta hai — saare user routes
       ek alag file me rakhte hain, app.js me nahi. Isse code clean aur scalable rehta hai.

  2. import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js"
     - Teen controller functions import kiye:
       • registerUser  → naya user banana
       • loginUser     → user login karna
       • logoutUser    → user logout karna
     - Controller me actual business logic hai, route file sirf "kahan jaana hai" batati hai.

  3. import { upload } from "../middlewares/multer.middleware.js"
     - Multer ka upload middleware import kiya.
     - Yeh file upload handle karta hai (images jaise avatar aur coverImage).
     - Register route pe lagaya gaya hai kyunki register karte waqt user photo deta hai.

  4. import { verifyJWT } from "../middlewares/auth.middleware.js"
     - JWT verification middleware import kiya.
     - Yeh check karta hai ki request me valid access token hai ya nahi.
     - Jo routes sirf logged-in users ke liye hain, unpe yeh middleware lagana zaroori hai.

  5. const router = Router()
     - Express ka ek naya Router instance banaya.
     - Yeh /api/v1/users ke baad wale saare sub-routes handle karega.

  6. router.route("/register").post(upload.fields([...]), registerUser)
     - POST /api/v1/users/register endpoint define kiya.
     - upload.fields([...]) → pehle middleware chalta hai jo avatar aur coverImage files accept karta hai.
       • name: "avatar", maxCount: 1    → sirf 1 avatar file accept hogi
       • name: "coverImage", maxCount: 1 → sirf 1 cover image accept hogi
     - registerUser → multer ke baad yeh controller chalta hai aur DB me user banata hai.

  7. router.route("/login").post(loginUser)
     - POST /api/v1/users/login endpoint define kiya.
     - Koi middleware nahi — login ke liye sirf username/email aur password chahiye.
     - loginUser controller credentials check karke tokens generate karta hai.

  8. router.route("/logout").post(verifyJWT, logoutUser)
     - POST /api/v1/users/logout endpoint define kiya.
     - verifyJWT → pehle middleware chalta hai: token valid hai tabhi aage jaega.
       Iske baad req.user me user ki details aa jaati hain.
     - logoutUser → phir controller DB se refreshToken hataata hai aur cookies clear karta hai.
     - Yeh ek "secured route" hai — bina valid JWT ke logout possible nahi.

  9. export default router
     - Is router ko default export kiya taaki app.js me import karke
       app.use("/api/v1/users", userRouter) se connect kiya ja sake.

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh file user-related saare HTTP routes define karti hai — register (with file upload),
  login (public), aur logout (JWT protected) — aur controllers se connect karti hai.

  📌 FULL ROUTE PATHS:
  POST /api/v1/users/register  → naya user banao (avatar + coverImage ke saath)
  POST /api/v1/users/login     → login karo, tokens milenge
  POST /api/v1/users/logout    → logout karo (JWT zaroori hai)
  =============================================================================
*/

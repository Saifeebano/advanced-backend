import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
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


export default router

/*

  =============================================================================
  📌 FILE: src/routes/user.routes.js  —  KYA AUR KYU KIYA?
  =============================================================================

  1. import { Router } from "express"
     - Express ka Router constructor import kiya.
     - Yeh humein modular routing banaane me help karta hai (saare routes ek hi file me na rakh kar alag alag files me rakhte hain).

  2. import { registerUser } from "../controllers/user.controller.js"
     - User related business logic handle karne waali controller function import ki.
     - Yahan par humne registerUser function ko import kiya.

  3. const router = Router()
     - Ek naya router instance create kiya.
     - Ye router ab /users routes ko handle karega.

  4. router.route("/register").post(registerUser)
     - Yeh ek single route par multiple HTTP methods define karne ka express ka short form hai.
     - registerUser controller ko register endpoint par POST request ke liye map kiya gaya.

  5. export default router
     - Created router ko export kiya taaki app.js me import karke use kiya ja sake.

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh file /users/register endpoint ke liye POST request ko registerUser controller se map karti hai
  aur is router ko export karti hai.
  =============================================================================
*/

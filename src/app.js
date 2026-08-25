// Express application setup
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
// is cookie parser se mai server se  access kr pau or set bhi kr pau.

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())



export { app }

/*
  =============================================================================
  📌 FILE: src/app.js  —  IS FILE ME KYA KYA HUA AUR KYU KIYA?
  =============================================================================

  1. import express from "express"
     - Express framework import kiya. Yeh Node.js ke liye ek web server framework hai.
     - Isse hum HTTP routes, middlewares, aur server bana sakte hain.

  2. import cors from "cors"
     - CORS (Cross-Origin Resource Sharing) package import kiya.
     - Jab frontend (React etc.) alag domain/port pe hota hai aur backend se request karta hai,
       toh browser by default block kar deta hai. CORS us block ko hatata hai.

  3. import cookieParser from "cookie-parser"
     - cookieParser middleware import kiya.
     - Isse server browser ke cookies ko read aur set kar sakta hai.
     - Example: Authentication token cookie me store karke client ko dena ya client ki cookie padhna.

  4. const app = express()
     - Express ka ek naya application instance banaya. Yahi hamaara main "app" object hai
       jis par saare middlewares aur routes lagenge.

  5. app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
     - CORS middleware globally apply kiya.
     - origin: .env se allowed frontend URL read karta hai (sirf wahi domain allow hogi).
     - credentials: true — cookies aur authorization headers bhi cross-origin requests me bheje ja sakte hain.

  6. app.use(express.json({ limit: "16kb" }))
     - Incoming JSON body requests ko parse karne ke liye middleware.
     - limit "16kb" rakha taaki koi badi/malicious JSON request server crash na kare.

  7. app.use(express.urlencoded({ extended: true, limit: "16kb" }))
     - HTML form data (URL-encoded format) ko parse karne ke liye.
     - extended: true — nested objects bhi handle kar sakta hai.
     - limit "16kb" — same security reason.

  8. app.use(express.static("public"))
     - "public" folder ke andar jo bhi files hain (images, CSS, etc.) unhe
       directly browser se access kiya ja sakta hai bina kisi route ke.

  9. app.use(cookieParser())
     - Cookie parsing middleware apply kiya taaki req.cookies se cookies read kar sakein.

  10. export { app }
      - Configured app ko export kiya taaki index.js me import karke server start ho sake.

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh file Express app ko configure karti hai — CORS, JSON parsing, URL encoding,
  static files aur cookie support set karke app ko export karti hai.
  =============================================================================
*/
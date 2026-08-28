const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler }

/*
  =============================================================================
  📌 FILE: src/utils/asyncHandler.js  —  KYA AUR KYU KIYA?
  =============================================================================

  1. const asyncHandler = (requestHandler) => { ... }
     - Yeh ek Higher-Order Function (HOF) hai.
     - HOF kya hai? Woh function jo doosre function ko argument me le ya return kare.
     - Yahan requestHandler (controller function) argument me liya gaya.
     - Kyu HOF? Kyunki har controller ko yeh same wrap karna hai — ek baar
       logic likh do aur reuse karo.

  2. return (req, res, next) => { ... }
     - Inner function return kiya jo actual Express middleware signature hai.
     - Express ko chahiye: (req, res, next) wala function.
     - Yahi function har request pe execute hoga.

  3. Promise.resolve(requestHandler(req, res, next))
     - requestHandler(req, res, next) → Controller function call kiya.
     - Promise.resolve() → Isse ensure kiya ki chahe controller async ho ya sync,
       dono cases handle hoon. Agar async hai toh Promise milega, agar sync hai toh
       Promise.resolve() use wrap karke Promise bana dega.
     - Kyu? Kyunki .catch() sirf Promise pe kaam karta hai.

  4. .catch((err) => next(err))
     - Agar controller function me koi error aaya (await fail, throw kiya etc.)
       toh error automatically catch ho jaata hai.
     - next(err) → Error ko Express ke global error handler ko pass kar deta hai.
     - Kyu next(err)? Express ka ek special 4-parameter error handler hota hai:
       (err, req, res, next) — jab next(err) call hota hai toh woh trigger hota hai.
     - Is wajah se EVERY controller me try-catch likhne ki zaroorat nahi!

  ─────────────────────────────────────────────────────────────────────────────
  🔄 BINA asyncHandler ke (try-catch manually):
  ─────────────────────────────────────────────────────────────────────────────
  const registerUser = async (req, res, next) => {
      try {
          // controller logic
      } catch(err) {
          next(err)  // har jagah yeh likhna padta
      }
  }

  ✅ asyncHandler KE SAATH:
  const registerUser = asyncHandler(async (req, res) => {
      // controller logic — catch automatically hoga
  })

  ─────────────────────────────────────────────────────────────────────────────
  📌 ALTERNATIVE APPROACH (try-catch wala asyncHandler):
  ─────────────────────────────────────────────────────────────────────────────
  const asyncHandler = (fn) => async (req, res, next) => {
      try {
          await fn(req, res, next)
      } catch (err) {
          res.status(err.code || 500).json({ success: false, message: err.message })
      }
  }
  → Dono approaches kaam karti hain — Promise.resolve().catch() wali zyada clean hai.

  =============================================================================
  🎯 EK LINE SUMMARY:
  asyncHandler ek Higher-Order Function hai jo async controller ko wrap karta hai
  aur unhandled Promise rejections ko automatically catch karke Express ke
  error handler ko pass karta hai — taaki har jagah try-catch nahi likhna pade.

  📌 INTERVIEW ME POOCHHE JAANE WAALE CONCEPTS:
  → Higher-Order Function (HOF) kya hota hai?
  → async/await aur Promise me kya farak hai?
  → Express me next(err) kyu call karte hain?
  → Promise.resolve() kyu use kiya — directly await kyu nahi?
  → Error middleware (4 params) kaise kaam karta hai Express me?
  → asyncHandler use karne ka kya fayda hai?
  =============================================================================
*/

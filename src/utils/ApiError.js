
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
    def = false
  ) {

    super(message)


    this.statusCode = statusCode


    this.data = null


    this.message = message


    this.success = false;

    this.errors = errors

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export { ApiError }

/*
  =============================================================================
  📌 FILE: src/utils/ApiError.js  —  IS FILE ME KYA KYA HUA AUR KYU KIYA?
  =============================================================================

  1. class ApiError extends Error { ... }
     - JavaScript ke built-in Error class ko extend (inherit) kiya.
     - Matlab ApiError ek "special" Error hai jisme hamare API ke liye
       zarori extra properties add ki gayi hain.

  2. constructor(statusCode, message, errors, stack, def)
     - Jab bhi new ApiError(...) likhte hain, yeh constructor call hota hai.
     - statusCode  => HTTP error code (400, 401, 404, 500 etc.)
     - message     => Human-readable error message
     - errors      => Validation errors ka array (multiple field errors)
     - stack       => Custom stack trace (optional, rarely pass karte hain)
     - def         => Future use ke liye placeholder flag

  3. super(message)
     - Parent class (Error) ko initialize kiya aur message pass kiya.
     - Yeh step zarori hai jab bhi class kisi aur class ko extend kare.

  4. this.statusCode, this.data, this.message, this.success, this.errors
     - Yeh saari properties set ki gayi hain taaki API ka error response
       consistent aur structured ho:
         { statusCode, data: null, message, success: false, errors }

  5. Error.captureStackTrace(this, this.constructor)
     - Node.js ka V8 engine method jo automatically stack trace capture karta hai.
     - ApiError class ka apna frame stack me nahi aata — cleaner debug info milti hai.

  6. export { ApiError }
     - Named export taaki koi bhi file import karke use kar sake:
       import { ApiError } from "../utils/ApiError.js"

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh file ek custom error class define karti hai jo standard Error ko extend
  karke HTTP statusCode, success flag aur errors array add karti hai — taaki
  poore project me API errors ek consistent format me return ho sakein.

  📌 USE KAISE KAREIN?
  throw new ApiError(400, "Username is required")
  throw new ApiError(401, "Unauthorized access")
  throw new ApiError(404, "User not found")
  throw new ApiError(500, "Internal server error")
  =============================================================================
*/

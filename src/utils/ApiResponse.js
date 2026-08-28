class ApiResponse {
    constructor(
        statusCode,
        data,
        message = "success"
    ) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }

/*
  =============================================================================
  📌 FILE: src/utils/ApiResponse.js  —  KYA AUR KYU KIYA?
  =============================================================================

  1. class ApiResponse { ... }
     - Ek simple class banai jo successful API responses ko structure deti hai.
     - Kyu class banai? Taaki poore project me saare successful responses ek hi
       consistent format me jayein — alag alag jagah alag format nahi.

  2. constructor(statusCode, data, message = "success")
     - statusCode → HTTP status code (200, 201, etc.)
     - data → Response me bhejna ka actual data (user object, list, etc.)
     - message → Human-readable success message, default "success" hai.
       Default value isliye di taaki agar message na dein toh bhi kaam kare.

  3. this.statusCode = statusCode
     - HTTP status code set kiya — client ko pata chale ki request kaisi rahi.
     - 200 = OK, 201 = Created, 204 = No Content etc.

  4. this.data = data
     - Actual response data set kiya — yahi frontend ko display karna hota hai.

  5. this.message = message
     - Success message set kiya — e.g., "User registered successfully".

  6. this.success = statusCode < 400
     - Ek boolean flag jo automatically set hota hai.
     - statusCode < 400 → Agar status 200, 201 etc. hai toh success = true.
     - statusCode >= 400 → Agar status 400, 500 etc. hai toh success = false.
     - Kyu? Frontend ko ek boolean flag se easily pata chal jaata hai ki
       request successful rahi ya nahi — bina statusCode check kiye.

  7. export { ApiResponse }
     - Named export — controllers me import karke use karein:
       return res.status(200).json(new ApiResponse(200, data, "message"))

  ─────────────────────────────────────────────────────────────────────────────
  📦 ACTUAL RESPONSE FORMAT (JSON):
  ─────────────────────────────────────────────────────────────────────────────
  {
    "statusCode": 200,
    "data": { ...user object... },
    "message": "User registered successfully",
    "success": true
  }

  ─────────────────────────────────────────────────────────────────────────────
  🔄 ApiError vs ApiResponse — FARK:
  ─────────────────────────────────────────────────────────────────────────────
  ApiError  → Error extend karta hai → failures ke liye → success: false
  ApiResponse → Plain class hai     → success ke liye → success: true/false

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh utility class successful API responses ko ek consistent format {statusCode,
  data, message, success} me wrap karti hai taaki poora project uniform responses bheje.

  📌 INTERVIEW ME POOCHHE JAANE WAALE CONCEPTS:
  → ApiResponse aur ApiError me kya farak hai?
  → this.success = statusCode < 400 yeh kya karta hai?
  → Default parameter (message = "success") kab kaam aata hai?
  → Kyu ek custom response class banai — direct res.json() kyu nahi?
  =============================================================================
*/
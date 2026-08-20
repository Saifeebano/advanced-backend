/*
  =============================================================================
  📌 FILE: src/constants.js
  -----------------------------------------------------------------------------
  🎯 PURPOSE / KYU USE KIYA HUA HAI:
  - Is file me hum apne application ke static constants (jaise DB_NAME, App Limits, etc.) store karte hain.
  - Kyu? Taaki Database Name ya koi bhi constant hardcode na karna pade har jagah.
  - Agar future me Database Name change karna ho, toh bas yahan 1 jagah change karenge aur pure project me update ho jayega.
  =============================================================================
*/

// Application constants
// src/constants.js

/*
  📌 DB_NAME:
  - "SStube" hamare MongoDB database ka naam hai.
  - Isko export kiya gaya hai taaki 'src/db/index.js' me ise import karke MONGODB_URI ke saath append (connect) kar sakein.
*/
export const DB_NAME = "SStube";

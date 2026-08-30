import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken() //method hai
    const refreshToken = user.generateRefreshToken() // method hai

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false }) // save is done here

    return { accessToken, refreshToken }  // return

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // 1. Get user details from frontend .
  // 2. Validate - not empety.
  // 3. Check if user already exists: username and email.
  // 4. check for images, checkfor avtar
  // 5. upload them to cloudinary, avtar
  // 6. create user object - creat entry in db
  // 7. remove password and refersh token field from response
  // 8. check for user creation
  // 9. return response

  const { username, email, password, fullName } = req.body

  if (
    [username, email, password, fullName].some((field) =>
      field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required")
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )


})

const loginUser = asyncHandler(async (req, res) => {
  //req body se data lao
  //username or email
  // find the user in db
  // password check karo
  // access token and refresh token use kro 
  // send cookies with response

  const { username, email, password } = req.body

  console.log(email);

  if (!username && !email) {
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password) // method hai
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id) // method hai

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const option = {
    httpOnly: true,
    secure: true
  }



  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          loggedInUser,
          accessToken,
          refreshToken
        },
        "User logged in successfully")
    )

})

// logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, "User logged out successfully")
    )

})
const refershAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken ||
    req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }


    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or invalid")
    }


    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token generated successfully")
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")


  }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user._id)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password")
  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Password changed successfully")
    )

})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "User fetched successfully")
    )
})


const updateAccountDetails = asyncHandler(async (req, res) => {

  const { fullName, email } = req.body

  if (!fullName || !email) {

    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email: email.toLowerCase()
      }
    },
    {
      new: true
    }
  )
    .select("-password")

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "User updated successfully")
    )

})



const updateUserAvatar = asyncHandler(async (req, res) => {

  const
    avatarLocalPath = req.files?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar.url) {
    throw new ApiError(400, "Failed to upload avatar")

  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {
      new: true
    }
  ).select("-password")

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "User updated successfully")
    )






})


const updateUserCoverImage = asyncHandler(async (req, res) => {

  const coverImageLocalPath = req.files?.path

  if (!coverImageLocalPath) {
    throw new ApiError(400, "cover image file is missing")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!coverImage.url) {
    throw new ApiError(400, "Failed to upload cover image")

  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    {
      new: true
    }
  ).select("-password")

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "User updated successfully")
    )






})


export {
  registerUser,
  loginUser,
  logoutUser,
  refershAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage

}

/* 
  =============================================================================
  📌 FILE: src/controllers/user.controller.js  —  KYA AUR KYU KIYA?
  =============================================================================

  1. import { asyncHandler } from "../utils/asyncHandler.js"
     - Yeh ek wrapper function hai jo async controller functions ko wrap karta hai.
     - Kyu? Normally async functions me try-catch likhna padta hai. asyncHandler yeh
       automatically karta hai — error automatically next(err) ko pass ho jaata hai.
     - Isse code DRY (Don't Repeat Yourself) rehta hai — baar baar try-catch nahi likhna.

  2. import { ApiError } from "../utils/ApiError.js"
     - Hamaari custom Error class import ki.
     - Kyu? throw new ApiError(400, "message") se consistent aur structured error
       response milta hai jisme statusCode, message aur success:false hota hai.

  3. import { User } from "../models/user.model.js"
     - Mongoose ka User model import kiya.
     - Kyu? Isse hum MongoDB ke "users" collection se data CRUD kar sakte hain.
       User.create(), User.findOne(), User.findById() — sab yahi model deta hai.

  4. import { uploadOnCloudinary } from "../utils/cloudinary.js"
     - Cloudinary pe file upload karne wala utility function import kiya.
     - Kyu? User ka avatar aur coverImage Cloudinary pe store hoti hain.
       Hamaare paas sirf URL save hota hai DB me, actual file Cloudinary pe hoti hai.

  5. import { ApiResponse } from "../utils/ApiResponse.js"
     - Hamaari custom Response class import ki.
     - Kyu? res.json(new ApiResponse(200, data, "message")) se saare responses
       ek consistent format me jaate hain: { statusCode, data, message, success }.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 FUNCTION: generateAccessAndRefreshToken(userId)
  ─────────────────────────────────────────────────────────────────────────────
  - Kyu banaya? Login aur registration ke baad tokens generate karne ka kaam
    baar baar hota tha, isliye ek helper function bana diya (reusability).
  - User.findById(userId)  → DB se user dhundhte hain.
  - user.generateAccessToken()   → JWT model method hai — short-lived token (15min).
  - user.generateRefreshToken()  → JWT model method hai — long-lived token (10days).
  - user.refreshToken = refreshToken → DB me refreshToken save kiya taaki logout me use ho.
  - user.save({ validateBeforeSave: false }) → Sirf refreshToken save karo,
    baki validations skip karo (password validation etc. yahan zarori nahi).
  - return { accessToken, refreshToken } → Dono tokens caller ko return kiye.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 FUNCTION: registerUser (POST /api/v1/users/register)
  ─────────────────────────────────────────────────────────────────────────────
  - const { username, email, password, fullName } = req.body
    → Request body se user ki details nikali (destructuring).

  - [].some((field) => field?.trim() === "")
    → Array ka .some() method check karta hai ki koi bhi field empty to nahi.
    → .trim() se whitespace-only values bhi catch ho jaati hain.
    → Optional chaining (?.) isliye taaki null/undefined pe crash na ho.

  - User.findOne({ $or: [{ username }, { email }] })
    → MongoDB ka $or operator — ya to username match karo ya email.
    → Kyu? Agar koi bhi ek match ho toh user already exist karta hai.

  - req.files?.avatar?.[0]?.path
    → Multer ne files req.files me daal di hain. avatar array ka pehla element
      [0] liya aur uska local disk path nikala.
    → Optional chaining (?.) isliye ki agar file nahi aai toh crash na ho.

  - Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0
    → CoverImage optional hai, isliye pehle check kiya ki exist karti hai ya nahi.

  - uploadOnCloudinary(avatarLocalPath) → Local file Cloudinary pe upload hui,
    response me URL milta hai (avatar.url), wahi DB me store hota hai.

  - User.create({ ... }) → MongoDB me naya user document insert kiya.
    → username.toLowerCase() → case insensitive uniqueness ke liye.

  - User.findById(user._id).select("-password -refreshToken")
    → Newly created user dhundha aur sensitive fields hataye (minus sign = exclude).
    → Kyu? Response me password ya refreshToken nahi bhejna chahiye — security risk!

  - res.status(201).json(new ApiResponse(200, createdUser, "User registered"))
    → 201 = Created HTTP status code. ApiResponse se consistent format.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 FUNCTION: loginUser (POST /api/v1/users/login)
  ─────────────────────────────────────────────────────────────────────────────
  - const { username, email, password } = req.body → request se credentials lo.

  - User.findOne({ $or: [{ username }, { email }] })
    → Ya username se dhundho ya email se — dono me se koi bhi kaam kare.

  - user.isPasswordCorrect(password)
    → Yeh User model ka custom method hai jo bcrypt.compare() use karta hai.
    → Hashed password ko plain password se compare karta hai — direct compare
      nahi ho sakta kyunki password hash karke store hota hai.

  - generateAccessAndRefreshToken(user._id) → Tokens generate kiye.

  - const option = { httpOnly: true, secure: true }
    → httpOnly: true → JavaScript se cookie access nahi hogi (XSS attack se bachao).
    → secure: true → Cookie sirf HTTPS pe bhegi (network sniffing se bachao).

  - res.cookie("accessToken", accessToken, option) → Browser ko cookie set karvaai.
    → Kyu? Mobile apps ke liye response body me bhi tokens diye hain.

  ─────────────────────────────────────────────────────────────────────────────
  🔧 FUNCTION: logoutUser (POST /api/v1/users/logout)
  ─────────────────────────────────────────────────────────────────────────────
  - req.user._id → verifyJWT middleware ne pehle req.user set kiya tha.
    Isliye yahan DB query lagake user dhundhna nahi pada.

  - User.findByIdAndUpdate(id, { $set: { refreshToken: undefined } }, { new: true })
    → $set operator → sirf ek field update karo (poora document replace mat karo).
    → refreshToken: undefined → DB se refreshToken hata diya.
    → Kyu? Refresh token hatane se user ab naya access token nahi bana sakta —
      effectively logged out ho jaata hai.
    → { new: true } → Updated document return karo (zaroori tha future use ke liye).

  - res.clearCookie("accessToken", options) → Browser se cookie delete karvaai.
    → Same httpOnly + secure options dena padta hai clearCookie me bhi — browser
      tabhi cookie delete karta hai agar options match karein.

  =============================================================================
  🎯 EK LINE SUMMARY:
  Yeh controller file User ke register, login aur logout ki poori business logic
  handle karti hai — validation, DB queries, file upload, JWT tokens, aur
  secure cookie management sab yahan hota hai.

  📌 INTERVIEW ME POOCHHE JAANE WAALE CONCEPTS:
  → asyncHandler kya hai aur kyu use kiya?
  → $or aur $set MongoDB operators kya hote hain?
  → httpOnly aur secure cookie options kyu lagate hain?
  → refreshToken DB me kyu save karte hain?
  → select("-password -refreshToken") kya karta hai?
  → validateBeforeSave: false kab use karte hain?
  =============================================================================
*/
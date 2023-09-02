const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a user
     
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{


//     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
// folder:"avatars",
// width:150,
// crop:"scale",

//     });
    const{name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            // public_id:myCloud.public_id,
            // url:myCloud.secure_url,
            public_id:"smple id",
            url:"sample url",
        }
});
sendToken(user,201,res);
});


// LOGIN USER

exports.loginUser = catchAsyncErrors(async(req,res,next)=>{

    const{email,password} = req.body;

    // checking if user has given  email nad password both

    if(!email||!password){
       return  next(new ErrorHandler("please Enter Email & Passsword",400));
    }

const user = await User.findOne({email}).select("+password"); 

if(!user){
    return next(new ErrorHandler("Invalid email or password",401));
}

const isPasswordMatched = await user.comparePassword(password);

if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid email or password",401));
}

sendToken(user,200,res);
});


// LogOut User

exports.logout = catchAsyncErrors(async(req,res,next)=>{

res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true
})

res.status(200).json({
success:true,
message:"Logged Out",
})
});


// Forgot Password

exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }


    // Get reset password token

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;



        const message = `Your Reset Password Token is :- \n\n ${resetPasswordUrl} \n      
         If you have not
         requested this email then ,please ignore it.`;

         try {
            
          await sendEmail({
            email:user.email,
            subject:`Agrawal Password Recovery`,
            message,
          });
         
          res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
          })

         } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({validateBeforeSave:false});

            return next(new ErrorHandler(error.message,500));
         }
});


// RESET PASSWORD

exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

    
    // Creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

const user  = await User.findOne({
resetPasswordToken,
resetPasswordExpire:{$gt:Date.now()},


});

if(!user){
    return next(new ErrorHandler("Reset Passwoerd Token is invalid or has been expired",400));
}

if(req.body.password!== req.body.confirmPassword){
    return next(new ErrorHandler("Password doesn't match",400));
}

user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;

await user.save();

sendToken(user,200,res);
});


// Get user details

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{


    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });
});


// Update User Password

exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{


    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect ",400));
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't matched",400));
    }

    user.password = req.body.newPassword;
await user.save();

   sendToken(user,200,res);
});




// Update User Profile

exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
   const newUserData = {
    name:req.body.name,
    email:req.body.email,
   }

// if(req.body.avatar !== ""){
//     const user = await User.findById(req.user.id);

//     const imageId = user.avatar.public_id;

//     await cloudinary.v2.uploader.destroy(imageId);

//     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
//         folder:"avatars",
//         width:150,
//         crop:"scale",
        
//             });

//             newUserData.avatar  = {
//                 public_id:myCloud.public_id,
//                 url:myCloud.secure_url,
//             }
// }

const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
});


res.status(200).json({
    success:true,
});
}); 



// GET ALL USERS (kitne user hai jinhe admin dekh sake)

exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{


const users = await User.find();

res.status(200).json({
    success:true,
    users,
});
});


// GET ALL USERS DETAILS (User's ki detail Admin dekh sake)

exports.getSingleUserDetail = catchAsyncErrors(async(req,res,next)=>{


    const user = await User.findById(req.params.id);
    
    if(!user){ 
        return next(new ErrorHandler(`User doesn't exist with Id :${req.params.id}`));
    }


    res.status(200).json({
        success:true,
        user,
    });
    });




    
// Update User Role--Admin (admin kisi bhi user ke role ko change kar sakta hai)

exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
     name:req.body.name,
     email:req.body.email,
     role:req.body.role,
    }
 
 await User.findByIdAndUpdate(req.params.id,newUserData,{
     new:true,
     runValidators:true,
     useFindAndModify:false,
 });
 
//  if(!user){ 
//     return next(new ErrorHandler(`User doesn't exist with Id :${req.params.id}`));
// }
// await user.save();
 
 res.status(200).json({
     success:true,
 });
 }); 




// Delete User -- Admin (admin kisi bhi user ko delete kar sakta hai)

exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);


if(!user){ 
    return next(new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`,400));
}
if(!user.role){ 
    return next(new ErrorHandler(`User role is not defined`,400));
}

// const imageId = user.avatar.public_id;

// await cloudinary.v2.uploader.destroy(imageId);

await user.deleteOne();

 res.status(200).json({
     success:true,
     message:"User Deleted Successfully",
 });
 }); 
 
const ErrorHandler = require("../utils/errorhander")

module.exports = (err,req,res,next) => {
err.statusCode = err.statusCode ||500;
err.message = err.message||"Internal Server Error";


//  Wrong Mongodb Id Error(CAST ERROR)
if(err.name==="CastError"){
    const message = `Resource not found.Invalid : ${err.path}`;
        err = new ErrorHandler(message,404);
}


// Mongoose Duplicate Key Error
if(err.code === 11000){
    const message = `Duplicate email '${err.keyValue.email}' entered`;
    err = new ErrorHandler(message,404);
}


//  Wrong jwt Error
if(err.name==="JsonWebTokenError"){
    const message = `Json Web Token is invalid,Try again`;
        err = new ErrorHandler(message,404);
}

//  Jwt Expire Error
if(err.name==="TokenExpiredError"){
    const message = `JsonWebToken is Expired,Try again`;
        err = new ErrorHandler(message,404);
}


res.status(err.statusCode).json({
    success:false,
   message:err.message,
});
};
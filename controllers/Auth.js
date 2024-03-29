const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator=require('otp-generator');
const Otp = require("../models/Otp");

exports.signUp = async (req, res) => {
  try {
    //Fetch data from request body
    const { firstName, lastName, email, password, phoneNumber, otp } = req.body;

    //Validating
    if (!firstName || !lastName || !email || !password || !otp) {
      return res.status(400).json({
        message: "Please provide all the required fields",
        success: false,
      });
    }

    //Check user exist or not
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.status(400).json({
        message: "User already registered!",
        success: false,
      });
    }

    //Find most recent OTP
    const recentOtp=await Otp.find({email}).sort({createdAt:-1}).limit(1);
    
    //Validate OTP
    if(recentOtp.length === 0){
      return res.status(400).json({
        message: 'Please try again, OTP not came',
        success:false
      });
    } 
    else if(otp !== recentOtp[0].otp){
      return res.status(400).json({
        message: 'OTP expired',
        success:false
      });
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      phoneNumber:phoneNumber,
      residentialAddress:null,
      country:null,
      city:null,
      instituteName:null,
      instituteAddress:null,
      instituteAreaPinCode:null,
      yearOfStudy:null,
    });

    //Returning response
    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: "Something went wrong while signing up",
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    //Fetch data from request body
    const { email, password } = req.body;

    //Validate data
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        success: false,
      });
    }

    //Validate existence of Email id
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    //Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Please enter correct password",
      });
    }

    //Create a playload
    const playload = {
      email: user.email,
      _id: user._id,
      userType: user.userType
    };

    //Generate JWT token
    const token = jwt.sign(playload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    user.token = token;
    user.password = undefined; //Removing from object not from database

    //Creating cookie and sending response
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "User logged in successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error while Logging in!",
    });
  }
};

exports.loginWithNumber = async (req, res) => {
  try {
    //Fetch data from request body
    const { phoneNumber, password } = req.body;

    //Validate data
    if (!phoneNumber || !password) {
      return res.status(400).json({
        message: "Please provide phoneNumber and password",
        success: false,
      });
    }

    //Validate existence of Email id
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    //Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "please enter correct password",
      });
    }

    //Create a playload
    const playload = {
      email: user.email,
      _id: user._id,
      userType: user.userType
    };

    //Generate JWT token
    const token = jwt.sign(playload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    user.token = token;
    user.password = undefined; //Removing from object not from database

    //Creating cookie and sending response
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "User logged in successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error while Logging in!",
    });
  }
};

exports.sendotp = async (req, res) => {
  try{
    //Fetching email from request body
    const {email} = req.body;

    //Check if user already exist or not
    const checkUserPresent = await User.findOne({email});
    if(checkUserPresent){
      return res.status(401).json({
        message: 'User already exist',
        success:false
        });
    }

    //Generating OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars:false,
    });
    console.log("OTP generated ", otp);

    //Check if OTP is unique or not
    let result=await Otp.findOne({otp:otp});
    while(result){
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
      });
      result=await Otp.findOne({otp:otp});
    }
    
    //Entry of OTP into DataBase
    const otpPayload={email, otp};
    const otpBody=await Otp.create(otpPayload);

    //saving the object in db 
    otpBody.save();

    return res.status(200).json({
      message: 'OTP sent Successfully!',
      success:true,
      otpBody
    })

  } catch(err){
    console.log(err)
    return res.status(500).json({
      success:false,
      message: "Error while sending OTP in send otp controller",
    });
  }
}

exports.verification = async (req, res, next) => {
  try{
    const token=req.header("Authorization").replace("Bearer ", "");
    if(!token){
      return res.status(401).json({
        success:false,
        message:"Token is missing!"
        });
    }
    try{
      const decoded= await jwt.verify(token.replace(/^"(.*)"$/, '$1'), process.env.JWT_SECRET);
      req.user=decoded;
    } catch(err){
      console.log(err)
      return res.status(401).json({
        success:false,
        err,
        message:"Invalid Token ( Inside middleware auth ) !",
      });
    }
    next();
  } catch(err){
    return res.status(500).json({
      success:false,
      err,
      message: "Error while Authorization!"
    });
  }
}

exports.isUser = async (req, res, next) => {
  try{
    if(req.user.userType !== "User"){
      return res.status(401).json({
        success:false,
        message:"You are not a valid user!"
      });
    }
    next();
  } catch(err){
    return res.status(500).json({
      success:false,
      message: "Error while Authorization of Customer!"
    });
  }
}

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try{
    if(req.user.userType != "Admin"){
      return res.status(401).json({
        success:false,
        message:"You are not a Admin!"
      });
    }
    next();
  } catch(err){
    return res.status(500).json({
      success:false,
      message: "Error while Authorization of Admin!"
    });
  }
}
const User = require("../models/User");


exports.UserDetailsUpdate = async (req, res) => {
  try{
    const userId = req.user._id;
    if(!userId){
      return res.status(400).json({
        message: "Please login first",
        success: false,
      });
    }
    const userDetails = await User.findById(userId);
    if(!userDetails){
      return res.status(400).json({
        message: "No user registered!",
        success: false,
      });
    }
    const { residentialAddress, country, city, instituteName, instituteAddress, instituteAreaPinCode, yearOfStudy } = req.body;

    userDetails.residentialAddress=residentialAddress;
    userDetails.country=country;
    userDetails.city=city;
    userDetails.instituteName=instituteName;
    userDetails.instituteAddress=instituteAddress;
    userDetails.instituteAreaPinCode=instituteAreaPinCode;
    userDetails.yearOfStudy=yearOfStudy;

    await userDetails.save();
    return res.status(200).json({
      success:true,
      message: "User details Successfully updated",
      userDetails
    })
  } catch(err){
    console.log(err);
    return res.status(400).json({
      message: "Something went wrong while updating user details",
      success: false,
    });
  }
}
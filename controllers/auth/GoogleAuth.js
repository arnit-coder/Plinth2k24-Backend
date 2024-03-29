const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("../../models/User");

exports.googleSignIn = async (req, res) => {
  //checking if the googleAccessToken is present in the request body
  console.log("signin controller")
  if (req.body.googleAccessToken) {
    // console.log(googleAccessToken)

    const { googleAccessToken } = req.body;
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const email = response.data.email;
        const user = await User.findOne({ email });
        if (!user)
          return res.status(404).json({ message: "User doesn't exist!" });

        const playload = {
          email: user.email,
          _id: user._id,
          userType: user.userType,
        };
  
        const token = jwt.sign(playload, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        user.token = token;

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

      })
      .catch((err) => {
        res.status(400).json({ message: "Invalid access token!" });
        console.log("error in signin controller");
        console.log(err);
      });
  } else {
    console.log("Token not found");
    res.send("Invalid");
  }
};

exports.googleSignUp = async (req, res) => {

  if (req.body.googleAccessToken) {
    const { googleAccessToken } = req.body;
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const firstName = response.data.given_name;
        const lastName = response.data.family_name;
        const email = response.data.email;
        const picture = response.data.picture;

        const existingUser = await User.findOne({ email });

        console.log("hello");

        if (existingUser) {
          return res.status(400).send(  "User already exists!" );
          console.log("user alreday exists");
        }

        const user = await User.create({
          email,
          firstName,
          lastName,
          image: picture,
        });

        const playload = {
          email: user.email,
          _id: user._id,
          userType: user.userType,
        };
        
        const token = jwt.sign(playload, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        user.token = token;
        console.log(token);
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

      })
      .catch((err) => {
        res.status(400).send( "Invalid access token!" );
      });
  } else {
    console.log("Token not found");
  }
};

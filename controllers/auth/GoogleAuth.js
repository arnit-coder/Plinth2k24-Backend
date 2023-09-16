const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("../../models/User");

exports.googleSignIn = async (req, res) => {
  console.log("signinController");
  if (req.body.googleAccessToken) {
    // google-auth
    // console.log("hello" + req.body.googleAccessToken);
    const { googleAccessToken } = req.body;

    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const email = response.data.email;
        const existingUser = await User.findOne({ email , userType: "google"});
        if (!existingUser)
          return res.status(404).json({ message: "User doesn't exist!" });

        const token = jwt.sign(
          {
            email: existingUser.email,
            id: existingUser._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        const userResponse = {
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          id: existingUser._id,
          token,
        };

        res.status(200).json({ result: userResponse });
      })
      .catch((err) => {
        res.status(400).json({ message: "Invalid access token!" });
        console.log("error in signin controller");
        console.log(err)
      });
  } else {
    res.send("Invalid");
  }
};

exports.googleSignUp = async (req, res) => {
  console.log("signupController");
  if (req.body.googleAccessToken) {
    const { googleAccessToken } = req.body;
    console.log(googleAccessToken);
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

        const existingUser = await User.findOne({ email, userType: "google" });

        if (existingUser)
          return res.status(400).json({ message: "User already exists!" });

        const result = await User.create({
          email,
          firstName,
          lastName,
          userType: "google",
          image: picture,
        });

        const token = jwt.sign(
          {
            email: result.email,
            id: result._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        const userResponse = {
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          token,
        };

        res.status(200).json({ result: userResponse });
      })
      .catch((err) => {
        res.status(400).json({ message: "Invalid access token!" });
      });
  } else {
    console.log("Token not found");
  }
};

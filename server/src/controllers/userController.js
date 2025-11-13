import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, postcode, mp, topic, message } = req.body;

    const newUser = new User({
      firstName,
      lastName,
      email,
      postcode,
      mp,
      topic,
      message,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User details saved successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

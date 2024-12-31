const { hashPassword, comparePassword, generateToken,decodeToken } = require("../Utils/authUtils");
const { registerUser, findUserByEmail,editUserById,findUserById } = require("../Model/userModel");

const registerUserController = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    
    if (existingUser) {
      // If the user exists, return a 400 response with a message
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // If no user exists, proceed with registration
    const hashedPassword = await hashPassword(password); 
    const newUser = await registerUser(firstName, lastName, email, hashedPassword, role);

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error registering user" });
  }
};

const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await comparePassword(password, user.password); // Use utility to compare passwords

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user); // Use utility to generate token

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error logging in" });
  }
};

//Edit user details
const editUserController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header (Bearer token)

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Decode the token and get the user id
    const userId = decodeToken(token); // Decode the token to get the user id

    const updates = req.body; // Contains fields to update

    // Check if the user exists by id
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    // Hash password if it's part of updates
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    // Edit the user by their id
    const updatedUser = await editUserById(userId, updates);
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user" });
  }
};


const getUserInfoController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header (Bearer token)

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Decode the token to get the user id
    const userId = decodeToken(token); // Assuming decodeToken is imported from utils
   
    // Fetch user details by userId
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user info (excluding sensitive fields like password)
    const { password, ...userInfo } = user; // Exclude password field
    res.status(200).json({ message: "User retrieved successfully", user: userInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving user information" });
  }
};





module.exports = { registerUserController, loginUserController, editUserController,getUserInfoController};

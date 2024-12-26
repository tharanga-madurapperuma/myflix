const { hashPassword, comparePassword, generateToken } = require("../Utils/authUtils");
const { registerUser, findUserByEmail,editUserByEmail } = require("../Model/userModel");

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
  const { email } = req.body; // Assuming `email` is part of the request body
  const updates = req.body; // Contains fields to update

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash password if it's part of updates
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    const updatedUser = await editUserByEmail(email, updates);
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user" });
  }
};




module.exports = { registerUserController, loginUserController, editUserController};

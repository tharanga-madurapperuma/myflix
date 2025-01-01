const { hashPassword, comparePassword, generateToken,decodeToken } = require("../Utils/authUtils");
const { registerUser, findUserByEmail,editUserById,findUserById } = require("../Model/userModel");

const registerUserController = async (req, res) => {
  
  const { firstName, lastName, email, password, role = "user" } = req.body;

  try {
    console.log(firstName, lastName, email, password, role);
    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Register the user
    const newUser = await registerUser(firstName, lastName, email, hashedPassword, role);

    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, firstName: newUser.first_name, lastName: newUser.last_name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error("Error in registerUserController:", err.message);
    res.status(500).json({ error: "Error registering user" });
  }
};

const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the password matches
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a token
    const token = generateToken(user); // Rename to `authToken` to match test expectations

    // Respond with the token
    res.status(200).json({ token });
  } catch (err) {
    console.error("Error in loginUserController:", err);
    res.status(500).json({ error: "Error logging in" });
  }
};


//Edit user details
const editUserController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header (Bearer token)
  const updates = req.body; // Contains fields to update

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Data is missing or invalid" });
  }

  try {
    // Decode the token and get the user id
    const userId = decodeToken(token); // Decode the token to get the user id


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

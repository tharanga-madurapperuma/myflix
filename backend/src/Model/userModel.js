const pool = require("../config/db");

// Function to register a user
const registerUser = async (firstName, lastName, email, hashedPassword, role = "user") => {
  try {
    
    const result = await pool.query(
      "INSERT INTO usermovie (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
      [firstName, lastName, email, hashedPassword, role]
    );
    return result.rows[0]; // Returning the first user row after insert
  } catch (err) {
    console.error("Error registering user:", err); // Logging the error for better debugging
    throw new Error("Error registering user"); // Rethrowing a generic error
  }
};
// Function to find a user by email
const findUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM userMovie WHERE email = $1", [email]);
    return result.rows[0];
  } catch (err) {
    throw new Error("Error fetching user");
  }
};

module.exports = { registerUser, findUserByEmail };

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

const findUserById = async (userId) => {
  try {
    const result = await pool.query("SELECT * FROM userMovie WHERE id = $1", [userId]);
    return result.rows[0];
  } catch (err) {
    throw new Error("Error fetching user by ID");
  }
};


const editUserById = async (userId, updates) => {
  try {
    const { firstName, lastName, password, role = "user" } = updates;

    // Build dynamic query based on provided fields
    const fields = [];
    const values = [];
    let index = 1;

    if (firstName) {
      fields.push(`first_name = $${index++}`);
      values.push(firstName);
    }
    if (lastName) {
      fields.push(`last_name = $${index++}`);
      values.push(lastName);
    }
    if (password) {
      fields.push(`password = $${index++}`);
      values.push(password);
    }
    if (role) {
      fields.push(`role = $${index++}`);
      values.push(role);
    }

    if (fields.length === 0) {
      throw new Error("No updates provided");
    }

    values.push(userId); // Add `userId` as the last value for WHERE clause

    const query = `
      UPDATE usermovie
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error editing user by ID:", err);
    throw new Error("Error editing user");
  }
};


module.exports = { registerUser, findUserByEmail,editUserById,findUserById };

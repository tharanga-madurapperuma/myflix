const { registerUser, findUserByEmail, findUserById } = require("../../src/Model/userModel");
const pool = require("../../src/config/db");

jest.mock("../../src/config/db"); // Mocking the database module

beforeAll(async () => {
  
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    throw new Error("Failed to connect to the database");
  }
});

afterAll(async () => {
  try {
    await pool.end();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error closing the database connection:", err.message);
  }
});
describe("User Model", () => {
  describe("registerUser", () => {
    it("should register a new user", async () => {
      // Arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "hashedPassword123",
        role: "user",
      };

      const mockResponse = {
        rows: [
          {
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            password: userData.password,
            role: userData.role,
          },
        ],
      };

      pool.query.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await registerUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
        userData.role
      );

      // Assert
      expect(result).toEqual(mockResponse.rows[0]); // Ensure the result matches the mocked response
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO usermovie (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [userData.firstName, userData.lastName, userData.email, userData.password, userData.role]
      );
    });

    it("should throw an error if registration fails", async () => {
      // Arrange
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act & Assert
      await expect(
        registerUser("John", "Doe", "john.doe@example.com", "hashedPassword123", "user")
      ).rejects.toThrow("Error registering user");
      expect(pool.query).toHaveBeenCalled();
    });
  });

  describe("findUserByEmail", () => {
    it("should return a user when found by email", async () => {
      // Arrange
      const email = "john.doe@example.com";
      const mockResponse = {
        rows: [
          { id: 1, email, first_name: "John", last_name: "Doe", password: "hashedPassword123", role: "user" },
        ],
      };

      pool.query.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await findUserByEmail(email);

      // Assert
      expect(result).toEqual(mockResponse.rows[0]);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM userMovie WHERE email = $1", [email]);
    });

    it("should throw an error if the query fails", async () => {
      // Arrange
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act & Assert
      await expect(findUserByEmail("john.doe@example.com")).rejects.toThrow("Error fetching user");
    });
  });

  describe("findUserById", () => {
    it("should return a user when found by ID", async () => {
      // Arrange
      const userId = 1;
      const mockResponse = {
        rows: [
          { id: userId, email: "john.doe@example.com", first_name: "John", last_name: "Doe", password: "hashedPassword123", role: "user" },
        ],
      };

      pool.query.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await findUserById(userId);

      // Assert
      expect(result).toEqual(mockResponse.rows[0]);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM userMovie WHERE id = $1", [userId]);
    });

    it("should throw an error if the query fails", async () => {
      // Arrange
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act & Assert
      await expect(findUserById(1)).rejects.toThrow("Error fetching user by ID");
    });
  });
});

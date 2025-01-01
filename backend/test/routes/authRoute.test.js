jest.setTimeout(30000);

const request = require("supertest");
const jwt = require("jsonwebtoken");
const {app,server} = require("../../src/server"); // Assuming app.js is the entry point of your application
const pool = require("../../src/config/db");

const secretKey = process.env.JWT_SECRET || "your-secret-key";

// Utility function to generate a mock JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: "1h" });
};

// Mock user data
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "testuser@example.com",
  password: "password123",
};

beforeAll(async () => {
    try {
      port = server.address().port;
      await pool.query("SELECT NOW()");
      console.log("Database connected successfully");
    } catch (err) {
      console.error("Error connecting to the database:", err.message);
      throw new Error("Failed to connect to the database");
    }
  });
  
  afterAll(async () => {
    try {
      await server.close(); // Properly close the server
      console.log("Server closed");
      await pool.end();
      console.log("Database connection closed");
    } catch (err) {
      console.error("Error closing the database connection:", err.message);
    }
  });

describe("Authentication Routes", () => {

  // Test for the Register route
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          password: mockUser.password,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message", "User registered successfully");
    });

    it("should return an error for missing email or password", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "",
        password: mockUser.password,
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", "All fields are required");
    });

    it("should return an error if the user already exists", async () => {
      // Assuming the user is already registered
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          password: mockUser.password,
        });
      
      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty("error", "User already exists");
    });
  });

  // Test for the Login route
  describe("POST /api/auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should return an error with incorrect credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: mockUser.email,
          password: "wrongpassword",
        });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should return an error if credentials are missing", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "",
        password: "",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", "Email and password are required");
    });
  });

  // Test for the Edit User route
  
  describe("PUT /api/auth/edit", () => {
    it("should update the user details successfully with a valid token", async () => {
      const token = generateToken({ id: "24", role: "user" }); // Mock token

      const response = await request(app)
        .put("/api/auth/edit")
        .set("Authorization", `Bearer ${token}`)
        .send({  password: "newpassword123" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "User updated successfully");
      expect(response.body.user).toHaveProperty("email", "tester@email.com");
    });

    it("should return an error if the request data is missing", async () => {
      const token = generateToken({ id: "24", role: "user" }); // Mock token

      const response = await request(app)
        .put("/api/auth/edit")
        .set("Authorization", `Bearer ${token}`)
        .send({}); // No data provided

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", "Data is missing or invalid");
    });

    it("should return an error if no token is provided", async () => {
      const response = await request(app)
        .put("/api/auth/edit")
        .send({ email: "newemail@example.com", password: "newpassword123" });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("error", "Unauthorized");
    });

    it("should return an error if the user does not exist", async () => {
      const token = generateToken({ id: "9999", role: "user" }); // Mock token with nonexistent user

      const response = await request(app)
        .put("/api/auth/edit")
        .set("Authorization", `Bearer ${token}`)
        .send({password: "newpassword123" });

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", "User not found");
    });
  });


  // Test for the Get User Info route
  describe("GET /api/auth/user", () => {
  it("should return user info with a valid token", async () => {
    const token = generateToken({ id: "24", role: "user" }); // Mock token

    const response = await request(app)
      .get("/api/auth/user")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "User retrieved successfully");
    expect(response.body.user).toHaveProperty("id", "24");
    expect(response.body.user).toHaveProperty("email"); // Ensure email is present
  });

  it("should return an error if no token is provided", async () => {
    const response = await request(app).get("/api/auth/user");

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error", "Unauthorized");
  });

  it("should return an error if the user does not exist", async () => {
    const token = generateToken({ id: "9999", role: "user" }); // Mock token with nonexistent user

    const response = await request(app)
      .get("/api/auth/user")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
  });
});

});


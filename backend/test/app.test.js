jest.setTimeout(30000);

const request = require("supertest");
const {app,server} = require("../src/server");
const pool = require("../src/config/db");

beforeAll(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    throw new Error("Failed to connect to the database");
  }
});

// Test for the root route ("/")
test("GET / should respond with Movie App API", async () => {
  const response = await request(app).get("/");
  expect(response.statusCode).toBe(200);
  expect(response.text).toBe("Movie App API");
});

// Test for /api/auth route
test("GET /api/auth should return 404 for undefined route", async () => {
  const response = await request(app).get("/api/auth/no-such-path");
  expect(response.statusCode).toBe(404);
});

// Test for /api/movie route
test("GET /api/movie should return 404 for undefined route", async () => {
  const response = await request(app).get("/api/movie/no-such-path");
  expect(response.statusCode).toBe(404);
});

// Environment variable manipulation
test("should return 404 when NODE_ENV is unset", async () => {
  process.env.NODE_ENV = ""; // Unset NODE_ENV
  const response = await request(app).get("/no-such-path");
  expect(response.statusCode).toBe(404);
  delete process.env.NODE_ENV; // Clean up the environment variable
});

// Cleanup after tests
afterAll(async () => {
  try {
    await server.close(); // Properly close the server
    console.log("Server closed");
    await pool.end(); // Close the database connection
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error during cleanup:", err.message);
  }
});

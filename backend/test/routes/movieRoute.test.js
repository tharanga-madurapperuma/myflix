jest.setTimeout(30000);

const request = require("supertest");
const {app,server} = require("../../src/server"); // Assuming app.js is the entry point of your application
const pool = require("../../src/config/db");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

const mock = new MockAdapter(axios);

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.API_KEY;

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


describe("Media Routes", () => {
  it("GET / should return Media Route message", async () => {
    const response = await request(app).get("/api/movie");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Media Route");
  });
});



describe("GET /fetch", () => {
  it("should return media details when valid query parameters are provided", async () => {
    const mockResponse = { id: 550, title: "Fight Club" };
    const url = `${BASE_URL}/movie/550?api_key=${API_KEY}&language=en`;
    mock.onGet(url).reply(200, mockResponse);
    console.log("Testing")
    

    const response = await request(app).get("/api/movie/fetch").query({
      type: "movie",
      action: "details",
      id: 550,
    });


    console.log("Mock URL:", url);
    console.log(response.statusCode);
console.log("Request URL:", response.request?.res?.responseUrl || "No URL");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it("should handle external API errors gracefully", async () => {
    const url = `${BASE_URL}/movie/550?api_key=${API_KEY}&language=en`;
    mock.onGet(url).reply(404, { status_message: "Not Found" });

    const response = await request(app).get("/api/movie/fetch").query({
      type: "movie",
      action: "details",
      id: 550,
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "Not Found");
  });
});

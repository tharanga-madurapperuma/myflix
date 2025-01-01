const {
    registerUserController,
    loginUserController,
    editUserController,
    getUserInfoController,
  } = require("../../src/controllers/authController");
  const {
    findUserByEmail,
    registerUser,
    findUserById,
    editUserById,
  } = require("../../src/Model/userModel");
  const { hashPassword, comparePassword, generateToken, decodeToken } = require("../../src/Utils/authUtils");
  
  jest.mock("../../src/Model/userModel");
  jest.mock("../../src/Utils/authUtils");
  
  describe("User Controller Tests", () => {
    describe("registerUserController", () => {
      it("should register a new user successfully", async () => {
        const req = {
          body: {
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            password: "password123",
            role: "user",
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        findUserByEmail.mockResolvedValue(null);
        hashPassword.mockResolvedValue("hashed_password123");
        registerUser.mockResolvedValue({
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "johndoe@example.com",
          role: "user",
        });
  
        await registerUserController(req, res);
  
        expect(findUserByEmail).toHaveBeenCalledWith(req.body.email);
        expect(hashPassword).toHaveBeenCalledWith(req.body.password);
        expect(registerUser).toHaveBeenCalledWith(
          req.body.firstName,
          req.body.lastName,
          req.body.email,
          "hashed_password123",
          req.body.role
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: "User registered successfully",
          user: {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            role: "user",
          },
        });
      });
  
      it("should return 400 if fields are missing", async () => {
        const req = { body: { email: "test@example.com" } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        await registerUserController(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "All fields are required" });
      });
  
      it("should return 409 if user already exists", async () => {
        const req = { body: { firstName: "John", lastName: "Doe", email: "test@example.com", password: "test123" } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
       
        findUserByEmail.mockResolvedValue({ email: "test@example.com" });
      
        await registerUserController(req, res);
      
      
        expect(findUserByEmail).toHaveBeenCalledWith("test@example.com");
      
   
        expect(res.status).toHaveBeenCalledWith(409);
      
       
        expect(res.json).toHaveBeenCalledWith({ error: "User already exists" });
      });
      
    });
  
    describe("loginUserController", () => {
      it("should log in a user successfully", async () => {
        const req = {
          body: { email: "test@example.com", password: "password123" },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        findUserByEmail.mockResolvedValue({ id: 1, email: "test@example.com", password: "hashed_password" });
        comparePassword.mockResolvedValue(true);
        generateToken.mockReturnValue("mock_token");
  
        await loginUserController(req, res);
  
        expect(findUserByEmail).toHaveBeenCalledWith("test@example.com");
        expect(comparePassword).toHaveBeenCalledWith("password123", "hashed_password");
        expect(generateToken).toHaveBeenCalledWith({ id: 1, email: "test@example.com", password: "hashed_password" });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: "mock_token" });
      });
  
      it("should return 401 if credentials are invalid", async () => {
        const req = { body: { email: "test@example.com", password: "wrong_password" } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        findUserByEmail.mockResolvedValue(null);
  
        await loginUserController(req, res);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
      });
    });
  
    describe("editUserController", () => {
      it("should update user details successfully", async () => {
        const req = {
          headers: { authorization: "Bearer mock_token" },
          body: { firstName: "UpdatedName" },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        decodeToken.mockReturnValue(1);
        findUserById.mockResolvedValue({ id: 1 });
        editUserById.mockResolvedValue({ id: 1, firstName: "UpdatedName" });
  
        await editUserController(req, res);
  
        expect(decodeToken).toHaveBeenCalledWith("mock_token");
        expect(findUserById).toHaveBeenCalledWith(1);
        expect(editUserById).toHaveBeenCalledWith(1, { firstName: "UpdatedName" });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "User updated successfully",
          user: { id: 1, firstName: "UpdatedName" },
        });
      });
  
      it("should return 401 if no token is provided", async () => {
        const req = { headers: {}, body: { firstName: "UpdatedName" } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        await editUserController(req, res);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
      });
    });
  
    describe("getUserInfoController", () => {
      it("should retrieve user information successfully", async () => {
        const req = {
          headers: { authorization: "Bearer mock_token" },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        decodeToken.mockReturnValue(1);
        findUserById.mockResolvedValue({ id: 1, firstName: "John", lastName: "Doe", password: "hashed_password" });
  
        await getUserInfoController(req, res);
  
        expect(decodeToken).toHaveBeenCalledWith("mock_token");
        expect(findUserById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "User retrieved successfully",
          user: { id: 1, firstName: "John", lastName: "Doe" },
        });
      });
    });
  });
  
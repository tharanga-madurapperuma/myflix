const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  decodeToken,
} = require("../../src/Utils/authUtils");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("authUtils", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      // Arrange
      const password = "plainPassword123";
      const hashedPassword = "hashedPassword123";
      bcrypt.hash.mockResolvedValueOnce(hashedPassword);

      // Act
      const result = await hashPassword(password);

      // Assert
      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it("should throw an error if hashing fails", async () => {
      // Arrange
      bcrypt.hash.mockRejectedValueOnce(new Error("Hashing error"));

      // Act & Assert
      await expect(hashPassword("plainPassword123")).rejects.toThrow("Hashing error");
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching passwords", async () => {
      // Arrange
      const password = "plainPassword123";
      const hashedPassword = "hashedPassword123";
      bcrypt.compare.mockResolvedValueOnce(true);

      // Act
      const result = await comparePassword(password, hashedPassword);

      // Assert
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it("should return false for non-matching passwords", async () => {
      // Arrange
      bcrypt.compare.mockResolvedValueOnce(false);

      // Act
      const result = await comparePassword("wrongPassword", "hashedPassword123");

      // Assert
      expect(result).toBe(false);
    });

    it("should throw an error if comparison fails", async () => {
      // Arrange
      bcrypt.compare.mockRejectedValueOnce(new Error("Comparison error"));

      // Act & Assert
      await expect(comparePassword("plainPassword123", "hashedPassword123")).rejects.toThrow(
        "Comparison error"
      );
    });
  });

  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      // Arrange
      const user = { id: 1, role: "user" };
      const mockToken = "mockJWTToken";
      jwt.sign.mockReturnValue(mockToken);

      // Act
      const token = generateToken(user);

      // Assert
      expect(token).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    });
  });

  describe("verifyToken", () => {
    it("should return decoded token if valid", () => {
      // Arrange
      const token = "mockJWTToken";
      const decodedToken = { id: 1, role: "user" };
      jwt.verify.mockReturnValue(decodedToken);

      // Act
      const result = verifyToken(token);

      // Assert
      expect(result).toEqual(decodedToken);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    });

    it("should throw an error for an invalid token", () => {
      // Arrange
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid or expired token");
      });

      // Act & Assert
      expect(() => verifyToken("invalidToken")).toThrow("Invalid or expired token");
    });
  });

  describe("decodeToken", () => {
    it("should return the user id from a valid token", () => {
      // Arrange
      const token = "mockJWTToken";
      const decodedToken = { id: 1, role: "user" };
      jwt.verify.mockReturnValue(decodedToken);

      // Act
      const result = decodeToken(token);

      // Assert
      expect(result).toBe(decodedToken.id);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    });

    it("should throw an error for an invalid token", () => {
      // Arrange
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid or expired token");
      });

      // Act & Assert
      expect(() => decodeToken("invalidToken")).toThrow("Invalid or expired token");
    });
  });
});

"use strict";

process.env.SECRET = "itsasecret";

const supertest = require("supertest");
const { app } = require("../src/server");

const mockRequest = supertest(app);

describe("Server Tests", () => {
  it("should respond with a 404 on an invalid route resource", async () => {
    const response = await mockRequest.get("/aboutPlant");
    expect(response.status).toBe(404);
  });

  it("should respond with a 404 on an invalid method", async () => {
    const response = await mockRequest.put("/collection");
    expect(response.status).toBe(404);
  });

  it("should respond with 200 and a message on a GET to /", async () => {
    const response = await mockRequest.get("/");
    expect(response.status).toBe(200);
    expect(response.text).toEqual(
      "Welcome to the plant.space E-Commerce API & Socket Server!"
    );
  });
});

// server/app.test.js

const request = require("supertest");
const app = require("./app"); 

//Mock OMDb and Redis
jest.mock("./services/omdb");
jest.mock("./cache/redisClient");

const omdb = require("./services/omdb");

beforeAll(() => {
  //Hide logs
  jest.spyOn(console, "log").mockImplementation(() => {});
  //Return mock movie data
  omdb.searchMovies.mockResolvedValue({
    movies: [],
    totalResults: 0,
  });
});

// Set test API key 
process.env.API_KEY = "test-key";

describe("GET /search rate limit", () => {
  it("allows 100 requests and blocks the 101st with 429", async () => {
    const agent = request(app);

    for (let i = 1; i <= 100; i++) {
      const res = await agent.get("/search").query({ title: "test" }).set("x-api-key", "test-key");

      expect(res.status).toBe(200);
    }

    const res101 = await agent.get("/search").query({ title: "test" }).set("x-api-key", "test-key");

    expect(res101.status).toBe(429);
    expect(res101.body).toEqual({
      status: 429,
      error: "Too many requests, please try again after an hour",
    });
  });
});

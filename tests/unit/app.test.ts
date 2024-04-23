import createServer from "../../src/app";
import config from "../../src/config";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("supertest");

// Mock of Redis DB
const mockRedis = {
  getData: jest.fn(),
  storeData: jest.fn(),
};

// Mock of the files functions
jest.mock("../../src/utils/files", () => ({
  __esModule: true,
  existsSync: jest.fn(),
  loadData: jest.fn(),
  exportData: jest.fn(),
}));

describe("API endpoints", () => {
  let app;

  beforeEach(() => {
    config.app.port = 3000;
    config.file = "sample.json";
    config.redis.host = "127.0.0.1";
    config.redis.port = 6379;
    app = createServer(mockRedis);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should respond with status 200 on /health", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
  });

  it("should respond with correct count on /count", async () => {
    mockRedis.getData.mockResolvedValue(10); // Mock the value returned by Redis
    const response = await request(app).get("/count");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Current count is 10");
  });

  it("should return key does not exist when it is not stored in Redis on /count", async () => {
    mockRedis.getData.mockResolvedValue(null);
    const response = await request(app).get("/count");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Count key was not found on Redis");
  });

  it("should store data in Redis and local file on /track", async () => {
    const requestData = { count: 5 };
    mockRedis.getData.mockResolvedValue(10); // Mock the value returned by Redis
    await request(app).post("/track").send(requestData);
    expect(mockRedis.storeData).toHaveBeenCalledWith("count", 15); // Check that set was called with the correct value
    // Check that it was properly exported to an external file
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    expect(require("../../src/utils/files").exportData).toHaveBeenCalledWith(
      expect.any(String), // Check if the file name was a valid one
      expect.objectContaining(requestData), // Check if data was properly exported
    );
  });

  it("should respond with error message for invalid data on /track", async () => {
    const invalidData = "not a JSON object";
    const response = await request(app).post("/track").send(invalidData);
    expect(response.status).toBe(200);
    expect(response.text).toContain("Data must be a valid JSON object");
  });

  it("should respond with 404 for unknown endpoints", async () => {
    const response = await request(app).get("/unknown");
    expect(response.status).toBe(404);
  });
});

import request from "supertest";

import createServer from "../../src/app";

// Mock of Redis DB
const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
};

// Mock of the files functions
jest.mock("../../src/utils/files", () => ({
  __esModule: true,
  existsSync: jest.fn(),
  loadData: jest.fn(),
  exportData: jest.fn(),
}));

// Mock of the DB functions
jest.mock("../../src/db/client", () => ({
  __esModule: true,
  getData: jest.fn(),
  storeData: jest.fn(),
}));

describe("API endpoints", () => {
  let app;

  beforeEach(() => {
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
    mockRedis.get.mockResolvedValue(10); // Mock the value returned by Redis
    const response = await request(app).get("/count");
    expect(response.status).toBe(200);
    expect(response.body).toBe(10);
  });

  it("should store data in Redis and local file on /track", async () => {
    const requestData = { count: 5 };
    mockRedis.get.mockResolvedValue(10); // Mock the value returned by Redis
    await request(app).post("/track").send(requestData);
    expect(mockRedis.set).toHaveBeenCalledWith("count", 15); // Check that set was called with the correct value
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

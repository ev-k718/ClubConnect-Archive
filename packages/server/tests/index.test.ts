import supertest from "supertest";
import app from "../src/app";

const request = supertest(app);

// test.skip( /*  to skip this test */ )
// test.only( /*  to only run this test */ )
test("Get 401 for API homepage when trying to access without token", async () => {
  const response = await request.get("/");
  expect(response.status).toBe(401);
});
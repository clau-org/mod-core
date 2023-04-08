// Import testing functions and modules needed for the tests
import { assert, assertEquals } from "../deps_tests.ts";
import { API, ApiConfig, ApiRouter } from "../src/api.ts";
import { Logger } from "../src/log.ts";

// Define the API config to be used in the tests
const apiConfig: ApiConfig = {
  name: "Test API",
};

// Define a test to ensure routers can be added to the API instance
Deno.test("API should add router", async () => {
  // Create an API instance
  const api = new API(apiConfig);

  // Create an ApiRouter instance and add it to the API instance
  const apiRouter = new ApiRouter();
  api.addRouter(apiRouter);

  // Assert that the routers property of the API instance has a length of 1 and contains the ApiRouter instance created earlier
  assertEquals(api.routers.length, 1);
  assertEquals(api.routers[0], apiRouter);
});

// Define a test to ensure the app property is correctly set up in the API instance
Deno.test("API should setup app", async () => {
  const api = new API(apiConfig);

  // Create an ApiRouter instance and add it to the API instance
  const apiRouter = new ApiRouter();
  api.addRouter(apiRouter);

  // Call the setupApp method on the API instance
  api.setupApp();

  // Assert that the app property of the API instance is truthy
  assert(api.app);

  // Assert that the logger property is correctly set in the app state
  assert(api.app?.state.logger);
  assertEquals(api.app?.state.logger, api.logger);
});

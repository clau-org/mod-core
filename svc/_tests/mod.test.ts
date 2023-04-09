// Import testing functions and modules needed for the tests
import { assert, assertEquals } from "./deps.test.ts";
import { Service, ServiceOptions, ServiceRouter } from "../mod.ts";

// Define the API config to be used in the tests
const serviceConfig: ServiceOptions = {
  name: "Test API",
};

// Define a test to ensure routers can be added to the API instance
Deno.test("service should add router", async () => {
  const service = new Service(serviceConfig);
  const serviceRouter = new ServiceRouter();

  service.addRouter(serviceRouter);

  // Assert that the routers property of the API instance has a length of 1 and contains the ApiRouter instance created earlier
  assertEquals(service.routers.length, 1);
  assertEquals(service.routers[0], serviceRouter);
});

// Define a test to ensure the app property is correctly set up in the API instance
Deno.test("service should setup service", async () => {
  const service = new Service(serviceConfig);
  const serviceRouter = new ServiceRouter();

  service.addRouter(serviceRouter);

  // Call the setupService method on the service instance
  service.setupService();

  // Assert that the app property of the API instance is truthy
  assert(service.app);

  // Assert that the logger property is correctly set in the app state
  assert(service.app!.state.logger);
  assertEquals(service.app!.state.logger, service.logger);
});

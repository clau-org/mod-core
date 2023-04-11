import { Service } from "./deps.ts";

import { serviceRouter as routerUser } from "./users/router.ts";

const service = new Service();

service.setDbUrl(
  "prisma://aws-us-east-1.prisma-data.com/?api_key=mY4engKpoOtH3QVxb9NWeTZ_NWpEeoT6CcLwsDAtpsefXTby_mpAjYXQj1qLL0yF",
);

service.addRouter(routerUser);

export { service };

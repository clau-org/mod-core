/*
const DBClient = ExtendDBClient(PrismaClient);

const db = new DBClient();
*/

type Constructor<T> = new (...args: any[]) => T;

function createDBClient<T extends Constructor<any>>(
  ClientClass: T,
): T & Constructor<DBClientFunctions> {
  return class extends ClientClass {
    constructor(...args: any[]) {
      super(...args);
    }

    setUrl(url: string) {
      const newClient = new (this.constructor as any)({
        datasources: { db: { url } },
      });
      Object.assign(this, newClient);
    }
  };
}

interface DBClientFunctions {
  setUrl(url: string): void;
}

export { PrismaClient } from "./generated/client/deno/edge.ts";

export class DBClient<t> {
  client?: t;
  class: any;
  constructor(PrismaClient: any) {
    this.class = PrismaClient;
  }

  setUrl(url: string) {
    this.client = new this.class({ datasources: { db: { url } } }) as t;
  }

  async run(command: any) {
    const client = this.client! as any;
    return client.$runCommandRaw(command);
  }

  async create(model: string, document: any) {
    const uuid = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const updatedAt = null;

    const response = await this.run(
      {
        insert: model,
        documents: [
          { uuid, createdAt, updatedAt, ...document },
        ],
      },
    );
    if (!response.ok) return response;

    const documents = await this.read(model, {
      filter: {
        uuid,
      },
    });

    return documents[0];
  }

  async read(model: string, command: any) {
    const response = await this.run({
      find: model,
      ...command,
    });
    if (response?.cursor?.firstBatch) return response?.cursor?.firstBatch;
    return response;
  }

  async update(model: string, command: any) {
    const { update = {}, query } = command ?? {};
    const updatedAt = new Date().toISOString();

    update.updatedAt = updatedAt;

    let documents = await this.read(model, {
      filter: query,
      limit: 1,
    });
    let document = documents[0];

    const response = await this.run(
      {
        update: model,
        updates: [
          {
            q: query,
            u: { ...document, ...update },
          },
        ],
      },
    );

    if (!response.ok) return response;

    documents = await this.read(model, {
      filter: query,
      limit: 1,
    });
    document = documents[0];
    return document;
  }

  async delete(model: string, command?: any) {
    const { query } = command ?? {};

    const response = await this.run({
      delete: model,
      deletes: [
        {
          q: query,
          limit: 1,
        },
      ],
    });

    if (!response.ok) return false;

    return true;
  }
}

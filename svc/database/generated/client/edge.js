
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  decompressFromBase64,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  findSync
} = require('./runtime/edge')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.12.0
 * Query Engine version: 659ef412370fa3b41cd7bf6e94587c1dfb7f67e7
 */
Prisma.prismaVersion = {
  client: "4.12.0",
  engine: "659ef412370fa3b41cd7bf6e94587c1dfb7f67e7"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = () => (val) => val


/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}


const dirname = '/'

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.ClauScalarFieldEnum = makeEnum({
  id: 'id'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});


exports.Prisma.ModelName = makeEnum({
  clau: 'clau'
});

const compressedDMMF = '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='
const decompressedDMMF = decompressFromBase64(compressedDMMF)
// We are parsing 2 times, as we want independent objects, because
// DMMFClass introduces circular references in the dmmf object
const dmmf = JSON.parse(decompressedDMMF)
exports.Prisma.dmmf = JSON.parse(decompressedDMMF)

/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/franciscoramos/Documents/clau/code/mod-core/svc/database/generated/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [],
    "previewFeatures": [
      "deno"
    ],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../../.env",
    "schemaEnvPath": "../../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "4.12.0",
  "engineVersion": "659ef412370fa3b41cd7bf6e94587c1dfb7f67e7",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "mongodb",
  "dataProxy": true
}
config.dirname = dirname
config.document = dmmf

config.inlineSchema = 'Ly8gVGhpcyBpcyB5b3VyIFByaXNtYSBzY2hlbWEgZmlsZSwKLy8gbGVhcm4gbW9yZSBhYm91dCBpdCBpbiB0aGUgZG9jczogaHR0cHM6Ly9wcmlzLmx5L2QvcHJpc21hLXNjaGVtYQpnZW5lcmF0b3IgY2xpZW50IHsKICAgIHByb3ZpZGVyICAgICAgICA9ICJwcmlzbWEtY2xpZW50LWpzIgogICAgcHJldmlld0ZlYXR1cmVzID0gWyJkZW5vIl0KICAgIG91dHB1dCAgICAgICAgICA9ICIuL2dlbmVyYXRlZC9jbGllbnQiCn0KCmRhdGFzb3VyY2UgZGIgewogICAgcHJvdmlkZXIgID0gIm1vbmdvZGIiCiAgICB1cmwgICAgICAgPSBlbnYoIkRBVEFQUk9YWV9VUkwiKQogICAgZGlyZWN0VXJsID0gZW52KCJEQVRBQkFTRV9VUkwiKQp9Cgptb2RlbCBjbGF1IHsKICAgIGlkIFN0cmluZyBAaWQgQGRlZmF1bHQoYXV0bygpKSBAbWFwKCJfaWQiKSBAZGIuT2JqZWN0SWQKfQo='
config.inlineSchemaHash = 'c788db22df08e8df4074e519e89f8da44d45c5d831a88b4fe2da3e86d8fa03fb'

config.inlineDatasources = {
  "db": {
    "url": {
      "fromEnvVar": "DATAPROXY_URL",
      "value": null
    }
  }
}

config.injectableEdgeEnv = {
  parsed: {
    DATAPROXY_URL: typeof globalThis !== 'undefined' && globalThis['DATAPROXY_URL'] || typeof process !== 'undefined' && process.env && process.env.DATAPROXY_URL || undefined
  }
}

config.edgeClientProtocol = "graphql";
if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)


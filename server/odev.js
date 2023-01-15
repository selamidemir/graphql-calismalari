const { createYoga, createSchema, createPubSub } = require("graphql-yoga");
const { createServer } = require("node:http");

const { typeDefs } = require("./assets/typeDefsOdev.js");
const resolvers = require("./resolvers/index");

const port = 4000;

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
});

const server = createServer(yoga);
server.listen(port, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});

const { createYoga, createSchema, createPubSub } = require("graphql-yoga");
const { createServer } = require("node:http");

const {typeDefs} = require("./assets/typeDefsOdev");
const {resolvers} = require("./assets/resolversOdev")

const port = 4000
// Provide your schema
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers
  }),
});

const server = createServer(yoga);
server.listen(port, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});

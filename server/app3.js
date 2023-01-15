const { createYoga, createSchema} = require("graphql-yoga");
const { createServer } = require("node:http");

const { typeDefs } = require("./assets/typeDefs");
const { resolvers } = require("./assets/resolvers3");

// Provide your schema
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
});

const server = createServer(yoga);
server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});

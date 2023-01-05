const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const books = [{ title: null, author: "Yazar 1" }];

const typeDefs = `#grapql
    type Author {
      name: String!,
      books: [Book]
    }

    type Book {
        title: String!
        author: String
    }

    type Query {
        books: [Book]
        authors: [Author]
    }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: 4000,
  });
  console.log("Apollo server başlatıldı. Sunucu adresi " + url + " dir.");
};

startServer();

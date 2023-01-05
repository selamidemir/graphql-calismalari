const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const { authors } = require("./data/authors");
const { books } = require("./data/books");

const typeDefs = `#graphql
    type Author {
        id: ID!
        name: String!
        surname: String
        gender: String
        email: String!
        books(filter: String): [Book]
    }

    type Book {
        id: ID!
        title: String!
        page: Int
        author(id: ID): Author
        publish: Boolean
    }

    type Query {
        book(id: ID): Book
        author(id: ID): Author
        books: [Book]
        authors: [Author]
    }
`;

const resolvers = {
  Query: {
    book: (parents, args) => {
      const id = args.id;
      const data = books.find((book) => String(book.id) === String(id));
      return data;
    },
    books: () => books,
    author: (parents, args) => authors.find(author => String(author.id) === String(args.id)),
    authors: () => authors,
  },
  Book: {
    author: (parent, args) => {
      const author = authors.find(author => String(author.id) === String(parent.author));
      return author;
    }
  },
  Author: {
    books: (parent, args) => {
      const authorBooks = books.filter(book => 
        String(book.author) === String(parent.id) && 
        book.title.startsWith(args.filter));
      return authorBooks;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async () => {
  const { url } = startStandaloneServer(server, { listen: 4000 });
  console.log(`Apollo Server start at ${url}`);
};

startServer();

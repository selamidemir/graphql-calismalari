const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const uniqid = require("uniqid");

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

    input AddAuthorInput {
      name: String! 
      surname: String! 
      email: String! 
      gender: String
    }

    type Book {
        id: ID!
        title: String!
        page: Int
        author(id: ID): Author
        publish: Boolean
    }

    input AddBookInput {
      title: String!
      page: Int
      author: ID!
      publish: Boolean
    }
    type Query {
        book(id: ID): Book
        author(id: ID): Author
        books: [Book]
        authors: [Author]
    }

    type Mutation {
      addAuthor(input: AddAuthorInput!): Author!
      addBook(data: AddBookInput): Book!
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
    author: (parents, args) =>
      authors.find((author) => String(author.id) === String(args.id)),
    authors: () => authors,
  },
  Book: {
    author: (parent, args) => {
      const author = authors.find(
        (author) => String(author.id) === String(parent.author)
      );
      return author;
    },
  },
  Author: {
    books: (parent, args) => {
      const authorBooks = books.filter(
        (book) =>
          String(book.author) === String(parent.id) &&
          book.title.startsWith(args.filter)
      );
      return authorBooks;
    },
  },
  Mutation: {
    addAuthor: (_, { input }) => {
      const { name, surname, email, gender } = input;
      const author = {
        id: uniqid(),
        name,
        surname,
        email,
        gender,
        books: [],
      };

      authors.push(author);
      return author;
    },
    addBook: (_, { data }) => {
      const { title, page, author, publish } = data;
      const book = {
        id: uniqid(),
        title,
        page,
        author,
        publish,
      };
      books.push(book);
      return book;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async () => {
  const { url } = startStandaloneServer(server, { listen: 4000 });
  console.log(`Apollo Server start at ${url}`);
};

startServer();

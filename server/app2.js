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

    input UpdateAuthorInput {
      name: String
      surname: String
      gender: String
      email: String
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

    input UpdateBookInput {
      title: String
      page: Int
      author: ID
      publish: Boolean
    }

    type Query {
        book(id: ID): Book
        author(id: ID): Author
        books: [Book]
        authors: [Author]
    }

    input DeleteAllOutput {
      length: Int
    }
    type Mutation {
      # Users
      addAuthor(input: AddAuthorInput!): Author!
      updateAuthor(id: ID, input: UpdateAuthorInput!): Author!

      # Books 
      addBook(data: AddBookInput): Book!
      updateBook(id: ID, input: UpdateBookInput): Book!
      deleteBook(id: ID!): Book!
      deleteAllBooks: Int!
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
    // Author
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
    updateAuthor: (_, { id, input }) => {
      const authorIndex = authors.findIndex(
        (author) => String(author.id) === String(id)
      );
      if (authorIndex < 0) {
        throw new Error("No found an author.");
      }
      authors[authorIndex] = {
        ...authors[authorIndex],
        ...input,
      };
      return authors[authorIndex];
    },

    // Books
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
    updateBook: (_, { id, input }) => {
      const bookIndex = books.findIndex(
        (book) => String(book.id) === String(id)
      );
      if (bookIndex < 0) throw new Error("No book found.");

      books[bookIndex] = {
        ...books[bookIndex],
        ...input,
      };

      return books[bookIndex];
    },
    deleteBook: (_, { id }) => {
      const bookIndex = books.findIndex(
        (book) => String(book.id) === String(id)
      );
      const book = books[bookIndex];
      if (bookIndex < 0) throw new Error("No Book found.");

      books.splice(bookIndex, 1);
      return book;
    },
    deleteAllBooks: (_, {id}) => {
      const length = books.length;
      books.length = 0;
      return length;
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async () => {
  const { url } = startStandaloneServer(server, { listen: 4000 });
  console.log(`Apollo Server start at ${url}`);
};

startServer();

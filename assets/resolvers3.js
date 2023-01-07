const { createPubSub } = require("graphql-yoga");
const uniqid = require("uniqid");

const { authors } = require("../data/authors");
const { books } = require("../data/books");

const pubSub = createPubSub();

exports.resolvers = {
  Query: {
    book: (_, args) => {
      const id = args.id;
      const data = books.find((book) => String(book.id) === String(id));
      return data;
    },
    books: () => books,
    author: (_, args) =>
      authors.find((author) => String(author.id) === String(args.id)),
    authors: () => authors,
  },
  Book: {
    author: (parent) => {
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
      pubSub.publish("authorAdded", author);
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
      pubSub.publish("authorUpdated", authors[authorIndex]);
      return authors[authorIndex];
    },
    deleteAuthor: (_, { id }) => {
      const index = authors.findIndex(
        (author) => String(author.id) === String(id)
      );
      if (index < 0) throw new Error("No author found.");
      const author = authors[index];
      authors.splice(index, 1);
      pubSub.publish("authorDeleted", author);
      return author;
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
      pubSub.publish("bookAdded", book);
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
      pubSub.publish("bookUpdated", books[bookIndex]);
      return books[bookIndex];
    },
    deleteBook: (_, { id }) => {
      const bookIndex = books.findIndex(
        (book) => String(book.id) === String(id)
      );
      const book = books[bookIndex];
      if (bookIndex < 0) throw new Error("No Book found.");

      books.splice(bookIndex, 1);
      pubSub.publish("bookDeleted", book);
      return book;
    },
    deleteAllBooks: (_, { id }) => {
      const length = books.length;
      books.length = 0;
      return length;
    },
  },
  Subscription: {
    countdown: {
      // This will return the value on every 1 sec until it reaches 0
      subscribe: async function* (_, { from }) {
        for (let i = from; i >= 0; i--) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          yield { countdown: i };
        }
      },
    },

    // Author
    authorAdded: {
      subscribe: () => pubSub.subscribe("authorAdded"),
      resolve: (payload) => payload,
    },
    authorUpdated: {
      subscribe: () => pubSub.subscribe("authorUpdated"),
      resolve: (payload) => payload,
    },
    authorDeleted: {
      subscribe: () => pubSub.subscribe("authorDeleted"),
      resolve: (payload) => payload,
    },

    // Book
    bookAdded: {
      subscribe: () => pubSub.subscribe("bookAdded"),
      resolve: (payload) => payload,
    },
    bookUpdated: {
      subscribe: () => pubSub.subscribe("bookUpdated"),
      resolve: (payload) => payload,
    },
    bookDeleted: {
      subscribe: () => pubSub.subscribe("bookDeleted"),
      resolve: (payload) => payload,
    },
  },
};

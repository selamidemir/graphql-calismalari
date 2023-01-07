exports.typeDefs = `#graphql
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
      updateAuthor(id: ID!, input: UpdateAuthorInput!): Author!
      deleteAuthor(id: ID!): Author!

      # Books 
      addBook(data: AddBookInput): Book!
      updateBook(id: ID, input: UpdateBookInput): Book!
      deleteBook(id: ID!): Book!
      deleteAllBooks: Int!
    }

    type Subscription {
      countdown(from: Int!): Int!

      # Author
      authorAdded: Author!
      authorUpdated: Author!
      authorDeleted: Author!

      # Book
      bookAdded: Book!
      bookUpdated: Book!
      bookDeleted: Book!
    }
`;


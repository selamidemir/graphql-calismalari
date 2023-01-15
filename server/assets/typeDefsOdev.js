exports.typeDefs = `#graphql
type User {
    id: ID!
    username: String!
    email: String!
}

input AddUserInput {
    username: String!
    email: String!
}

input UpdateUserInput {
    username: String
    email: String
}

type Event {
    id: ID!
    title: String!
    desc: String
    date: String!
    from: String
    to: String
    locationID: ID!
    userID: ID
    user: User
    participants: [Participant]
    location: Location!
}

type Location {
    id: ID!
    name: String!
    desc: String
    lat: Float
    lng: Float
}

type Participant {
    id: ID!
    userID: ID!
    eventID: ID!
}

type Query {
    # Users queries
    users: [User!]
    user(id: ID!): User

    # Events queries
    events: [Event]
    event(id: ID!): Event

    # Locations queries
    locations: [Location!]
    location(id: ID!): Location

    # Participant queries
    participants: [Participant!]
    participant(id: ID!): Participant
}

type Mutation {
    # Users
    addUser(input: AddUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput): User!
    deleteUser(id: ID!): User!
    deleteAllUsers: Int!

    # Book
    addBook(input: AddBookInput): Book!
}

type Subscription {
    userAdded: User!
    userUpdated: User!
    userDeleted: User!
}
`;

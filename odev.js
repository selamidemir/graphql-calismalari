const uniqid = require("uniqid");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const { odevData } = require("./data/odev");
const { users, events, locations, participants } = odevData;

const port = 4000;
const typeDefs = `#graphql
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
    }
`;

const resolvers = {
  // Queries
  Query: {
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === parent.id),
    events: () => events,
    event: (parent, args) => events.find((event) => event.id === parent.id),
    participants: () => participants,
    participant: (parent, args) =>
      participants.find((participant) => participant.id === parent.id),
  },
  Event: {
    user: (parent, args) => users.find((user) => user.id === parent.user_id),
    participants: (parent, args) =>
      participants.filter((participant) => participant.event_id === parent.id),
    location: (parent, args) =>
      locations.find((location) => location.id === parent.location_id),
  },
  Mutation: {
    // Users
    addUser: (_, { input }) => {
      const { username, email } = input;
      if (!username || !email) throw new Error("Some fileds is empty.");
      const user = {
        id: uniqid(),
        username,
        email,
      };
      users.push(user);
      return user;
    },
    updateUser: (_, { id, input }) => {
      console.log(id, input);
      const { username, email } = input;
      const userIndex = users.findIndex(
        (user) => String(user.id) === String(id)
      );
      if (userIndex < 0) throw new Error("No user found.");
      users[userIndex] = {
        id,
        username: username ? username : users[userIndex].username,
        email: email ? email : users[userIndex].email,
      };
      return users[userIndex];
    },
    deleteUser: (_, { id }) => {
      const userIndex = users.findIndex(
        (user) => String(user.id) === String(id)
      );
      if (userIndex < 0) throw new Error("No user found.");
      const user = users[userIndex];
      users.splice(userIndex, 1);
      return user;
    },
    deleteAllUsers: () => {
      const length = users.length;
      users.length = 0;
      return length;
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async (port) => {
  await startStandaloneServer(server, { listen: port });
  console.log("Apollo server starts at " + port + " port.");
};

startServer(port);

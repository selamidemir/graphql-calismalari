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
};

const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async (port) => {
  await startStandaloneServer(server, { listen: port });
  console.log("Apollo server starts at " + port + " port.");
};

startServer(port);

const uniqid = require("uniqid");
const { createPubSub } = require("graphql-yoga");

const { odevData } = require("../data/odev");
const { books } = require("../data/books");
const { users, events, locations, participants } = odevData;

const pubSub = createPubSub();

exports.resolvers = {
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
      pubSub.publish("userAdded", user);
      return user;
    },
    updateUser: (_, { id, input }) => {
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
      pubSub.publish("userUpdated", users[userIndex]);
      return users[userIndex];
    },
    deleteUser: (_, { id }) => {
      const userIndex = users.findIndex(
        (user) => String(user.id) === String(id)
      );
      if (userIndex < 0) throw new Error("No user found.");
      const user = users[userIndex];
      users.splice(userIndex, 1);
      pubSub.publish("userDeleted", user);
      return user;
    },
    deleteAllUsers: () => {
      const length = users.length;
      users.length = 0;
      return length;
    },
  },
  Subscription: {
    userAdded: {
      subscribe: () => pubSub.subscribe("userAdded"),
      resolve: (payload) => payload,
    },
    userUpdated: {
      subscribe: () => pubSub.subscribe("userUpdated"),
      resolve: (payload) => payload,
    },
    userDeleted: {
      subscribe: () => pubSub.subscribe("userDelete"),
      resolve: (payload) => payload,
    },
    bookAdded: {
      subscribe: () => pubSub.subscribe("bookAdded"),
      resolve: (payload) => payload
    }
  },
};

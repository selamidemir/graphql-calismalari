const uniqid = require("uniqid");
const { data } = require("../data/odev");
const { pubSub } = require("../pubSub");

const { users} = data;

const Mutation = {
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
  }

module.exports = Mutation;
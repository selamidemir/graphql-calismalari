const { pubSub } = require("../pubSub");

const Subscription = {
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
  }

module.exports = Subscription;
const { data } = require("../data/odev");
const { users, participants, events} = data;

const Query = {
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === parent.id),
    events: () => events,
    event: (parent, {id}) => events.find((event) => String(event.id) === String(id)),
    participants: () => participants,
    participant: (parent, args) =>
      participants.find((participant) => participant.id === parent.id),
  }

  module.exports = Query;
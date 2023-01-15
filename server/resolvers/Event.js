const { data } = require("../data/odev");
const { users, participants, locations} = data;

const Event = {
  user: (parent, args) => users.find((user) => user.id === parent.user_id),
  participants: (parent, args) =>
    participants.filter((participant) => participant.event_id === parent.id),
  location: (parent, args) =>
    locations.find((location) => location.id === parent.location_id),
};

module.exports = Event;

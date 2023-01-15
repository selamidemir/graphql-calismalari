const { WebSocketServer } = require('ws') ; // yarn add ws
// import ws from 'ws'; yarn add ws@7
// const WebSocketServer = ws.Server;
const { useServer } = require('graphql-ws/lib/use/ws');
const { typeDefs } = require('./assets/resolvers3');

const server = new WebSocketServer({
  port: 4001,
  path: '/graphql',
});

useServer({ typeDefs }, server);

console.log('Listening to port 4001');
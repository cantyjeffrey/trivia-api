require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const fetch = require('node-fetch');
const resolvers = require('./resolvers');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'typedefs.graphql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');

let token = ``;
const createSessionToken = async () => {
  if (token) return token;
  const response = await fetch(
    `https://opentdb.com/api_token.php?command=request`
  ).then(res => res.json());

  token = response.token;
  return token;
};

const context = async () => ({
  token: await createSessionToken(),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: true,
  tracing: true,
  debug: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

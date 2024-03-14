import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

const todos = [
    {
        title: 'Test01',
        description: 'This is test todo.'
    },
    {
        title: 'Test02',
        description: 'This is test todo.'
    }
]

const typeDefs = `#graphql
    type Todo {
        title: String
        description: String
    }

    type Query {
        todos: [Todo]
    }
`;

const resolvers = {
    Query: {
        todos: () => todos,
    },
};

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start()

app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000`)

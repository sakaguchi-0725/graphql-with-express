import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const todos = [
    {
        id: 1,
        title: 'Test01',
        description: 'This is test todo.'
    },
    {
        id: 2,
        title: 'Test02',
        description: 'This is test todo.'
    }
];
const resolvers = {
    Query: {
        todos: async (_parent, _args, context) => {
            return context.prisma.todo.findMany();
        },
    },
    Mutation: {
        createTodo: async (_parent, args, context) => {
            const newTodo = context.prisma.todo.create({
                data: {
                    title: args.title,
                    description: args.description
                }
            });
            return newTodo;
        }
    }
};
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs: fs.readFileSync('./src/schema.graphql', 'utf-8'),
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(cors(), bodyParser.json(), expressMiddleware(server, {
    context: async ({ req }) => ({
        ...req,
        prisma
    })
}));
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);

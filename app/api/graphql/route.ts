// api/graphql/route.ts
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

const typeDefs = `
  type Todo {
    id: Int!
    title: String!
    done: Boolean!
    createdAt: String!
  }

  type Query {
    todos: [Todo!]!
    todoById(id: Int!): Todo
  }

  type Mutation {
    createTodo(title: String!): Todo!
    toggleTodoDone(id: Int!): Todo!
    deleteTodo(id: Int!): Todo!
  }
`;

const resolvers = {
  Query: {
    todos: async () => await prisma.todo.findMany(),
    todoById: async (_: never, { id }: { id: number }) => await prisma.todo.findUnique({ where: { id } }),
  },
  Mutation: {
    createTodo: async (_: never, { title }: { title: string }) =>
      await prisma.todo.create({ data: { title } }),
    toggleTodoDone: async (_: never, { id }: { id: number }) => {
      const todo = await prisma.todo.findUnique({ where: { id } });
      if (!todo) throw new Error("Todo not found");

      return await prisma.todo.update({
        where: { id },
        data: { done: !todo.done },
      });
    },
    deleteTodo: async (_: never, { id }: { id: number }) =>
      await prisma.todo.delete({ where: { id } }),
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer);

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

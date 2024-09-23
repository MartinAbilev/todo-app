// app/page.tsx
'use client';

import { gql, useQuery, useMutation } from '@apollo/client';
import client from './apolloClient';
import { Todo } from '@prisma/client';
// import { useEffect } from 'react';

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      done
      createdAt
    }
  }
`;

const TOGGLE_TODO_DONE = gql`
  mutation ToggleTodoDone($id: Int!) {
    toggleTodoDone(id: $id) {
      id
      done
    }
  }
`;

export default function Home() {
  const { data, loading, error, refetch } = useQuery(GET_TODOS, { client });
  const [toggleTodoDone] = useMutation(TOGGLE_TODO_DONE, { client });

  const handleToggleDone = async (id: number) => {
    await toggleTodoDone({
      variables: { id },
    });
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {data?.todos.map((todo: Todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.done ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
              onClick={() => handleToggleDone(todo.id)}
            >
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// app/create/page.tsx
'use client';

import { gql, useMutation } from '@apollo/client';
import client from '../apolloClient';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      id
      title
      done
    }
  }
`;

export default function CreateTodo() {
  const [createTodo] = useMutation(CREATE_TODO, { client });
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleCreateTodo = async () => {
    if (title.trim() === '') return;
    await createTodo({
      variables: { title },
    });
    setTitle('');
    router.push('/');
  };

  return (
    <div>
      <h1>Create Todo</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter todo title"
      />
      <button onClick={handleCreateTodo}>Add Todo</button>
      <button onClick={() => router.push('/')}>Cancel</button>
    </div>
  );
}

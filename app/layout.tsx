// app/layout.tsx
import './globals.css'; // Optional: add any global CSS here
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <a href="/">Home</a> | <a href="/create">Create Todo</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

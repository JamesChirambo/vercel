import React from 'react';
import { useEffect, useState } from 'react';
// import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [date, setDate] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function getDate() {
      setStatus('loading');
      setError(null);

      try {
        const res = await fetch('/api/date', {
          signal: controller.signal,
          headers: { Accept: 'text/plain' },
        });

        if (!res.ok) {
          const body = await res.text().catch(() => '');
          throw new Error(
            `Request failed: ${res.status} ${res.statusText}${
              body ? ` — ${body}` : ''
            }`
          );
        }

        const newDate = (await res.text()).trim();
        setDate(newDate);
        setStatus('success');
      } catch (err) {
        // Ignore abort errors (e.g. component unmount / React strict mode double-invoke in dev)
        if (err?.name === 'AbortError') return;

        setStatus('error');
        setError(err instanceof Error ? err.message : String(err));
      }
    }

    getDate();

    // Cleanup aborts fetch on unmount
    return () => controller.abort();
  }, []);

  return (
    <main>
      <h1>Understanding Data Visualisation</h1>

      <h2>
        Deployed with{' '}
        <a
          href="https://vercel.com/docs"
          target="_blank"
          rel="noreferrer noopener"
        >
          Vercel
        </a>
        !
      </h2>

      <p>
        <a
          href="https://github.com/vercel/vercel/tree/master/examples/create-react-app"
          target="_blank"
          rel="noreferrer noopener"
        >
          This project
        </a>{' '}
        was created for learning purposes and was bootstrapped with{' '}
        <a
          href="https://facebook.github.io/create-react-app/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Create React App
        </a>{' '}
        and contains three directories, <code>/public</code> for static assets,{' '}
        <code>/src</code> for components and content, and <code>/api</code> which
        contains a serverless <a href="https://golang.org/">Go</a> function.
      </p>

      <section>
        {status === 'idle' && <p>Ready.</p>}
        {status === 'loading' && <p>Loading server date…</p>}
        {status === 'success' && <p>Server date: {date}</p>}
        {status === 'error' && (
          <p role="alert" style={{ whiteSpace: 'pre-wrap' }}>
            Could not load date: {error}
          </p>
        )}
      </section>
    </main>
  );
}

export default App;

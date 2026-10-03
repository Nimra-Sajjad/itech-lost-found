import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {DatabaseService} from './oop/DatabaseService';
import './index.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
    Loading iTECH Lost &amp; Found…
  </div>
);

DatabaseService.getInstance()
  .init()
  .then(() => root.render(<App />))
  .catch((err) => {
    console.error('Failed to load data from Supabase:', err);
    root.render(
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-slate-800 font-semibold">Couldn&apos;t connect to the server.</p>
        <p className="text-slate-500 text-sm">Check your connection and try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm"
        >
          Retry
        </button>
      </div>
    );
  });

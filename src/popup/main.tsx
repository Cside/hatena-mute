import { createRoot } from 'react-dom/client';
import { App } from './components/App';

const root = document.querySelector('.react-root');
if (!root) throw new Error('.react-root is not found');

createRoot(root).render(<App />);

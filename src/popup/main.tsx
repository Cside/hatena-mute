import { createRoot } from 'react-dom/client';
import { $ } from '../utils';
import { App } from './components/App';

createRoot($('.react-root')).render(<App />);

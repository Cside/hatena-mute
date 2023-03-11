import { createRoot } from 'react-dom/client';
import '../sentry/react';
import { $ } from '../utils';
import { App } from './components/App';

createRoot($('.react-root')).render(<App />);

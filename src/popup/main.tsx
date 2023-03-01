import { createRoot } from 'react-dom/client';
import { initSentry } from '../sentry';
import { $ } from '../utils';
import { App } from './components/App';

initSentry();
createRoot($('.react-root')).render(<App />);

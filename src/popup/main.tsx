import * as sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import { initSentry } from '../sentry';
import { $ } from '../utils';
import { App } from './components/App';

initSentry(sentry);
createRoot($('.react-root')).render(<App />);

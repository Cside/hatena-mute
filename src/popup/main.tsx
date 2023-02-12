import { render } from 'preact';
import { App } from './components/App';

const root = document.querySelector('.preact-root');
if (!root) throw new Error('.preact-root is not found');

render(App, root);

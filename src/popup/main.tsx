import { render } from 'preact';

const App = () => {
  return <h1>Hello World</h1>;
};

const root = document.querySelector('.preact-root');
if (!root) throw new Error('.preact-root is not found');

render(<App />, root);

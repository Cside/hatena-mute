import Container from 'react-bootstrap/Container';
import { LighteningOptions } from '../LightningOptions';
import { MuteOptions } from '../MuteOptions';
import './bootstrap.scss';
import './styles.scss';

export const App = () => {
  return (
    <Container fluid="sm" className="m-1">
      <MuteOptions />
      <LighteningOptions />
    </Container>
  );
};

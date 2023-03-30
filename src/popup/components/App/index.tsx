import Container from 'react-bootstrap/Container';
import { Footer } from '../Footer';
import { LighteningOptions } from '../LightningOptions';
import { MuteOptions } from '../MuteOptions';
import { PermissionRequest } from '../PermissionRequest';
import './bootstrap.scss';
import './styles.scss';

export const App = () => {
  return (
    <Container fluid="sm" className="m-1">
      <PermissionRequest />
      <MuteOptions />
      <LighteningOptions />
      <Footer />
    </Container>
  );
};

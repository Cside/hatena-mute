import { Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { LighteningOptions } from '../LightningOptions';
import { MuteOptions } from '../MuteOptions';
import { PermissionRequest } from '../PermissionRequest';

import './bootstrap.scss';
import './styles.scss';

export const App = () => {
  return (
    <Container fluid="sm">
      <h1 className="my-3 d-flex justify-content-between">
        <span className="d-flex align-items-center gap-1">
          <img src="./images/icon128.png" width="40" height="40" />
          <span className="fs-4 fw-bold">はてなミュート</span>
        </span>
        <Form.Check checked={true} id="disable-all" type="switch" />
      </h1>
      <PermissionRequest />
      <MuteOptions />
      <LighteningOptions />
    </Container>
  );
};

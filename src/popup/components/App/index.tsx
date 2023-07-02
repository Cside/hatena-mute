import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Header } from '../Header';
import { LighteningOptions } from '../LightningOptions';
import { MuteOptions } from '../MuteOptions';
import { PermissionRequest } from '../PermissionRequest';

import './bootstrap.scss';
import './styles.scss';

export const App = () => {
  const [allEnabled, setAllEnabled] = useState(false);

  return (
    <Container fluid="sm">
      <Header checked={allEnabled} setChecked={setAllEnabled} />
      <PermissionRequest />
      <div className={allEnabled ? '' : 'opacity-50'}>
        <MuteOptions />
        <LighteningOptions />
      </div>
    </Container>
  );
};

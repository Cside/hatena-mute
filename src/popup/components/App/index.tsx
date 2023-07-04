import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { LighteningOptions } from '../LightningOptions';
import { MuteOptions } from '../MuteOptions';
import { PermissionRequest } from '../PermissionRequest';

import './bootstrap.scss';
import './styles.scss';

export const App = () => {
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(false);

  return (
    <Container fluid="sm">
      <Header checked={isExtensionEnabled} setChecked={setIsExtensionEnabled} />
      <PermissionRequest />
      <div className={isExtensionEnabled ? '' : 'opacity-50'}>
        <MuteOptions />
        <LighteningOptions />
        <Footer />
      </div>
    </Container>
  );
};

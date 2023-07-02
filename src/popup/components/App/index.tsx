import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { STORAGE_KEY } from '../../../constants';
import { userOption } from '../../../userOption';
import { LighteningOptions } from '../LightningOptions';
import { MuteOptions } from '../MuteOptions';
import { PermissionRequest } from '../PermissionRequest';

import './bootstrap.scss';
import './styles.scss';

export const App = () => {
  const [allEnabled, setAllEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      setAllEnabled(await userOption.get<boolean>(STORAGE_KEY.ALL_ENABLED));
    })();
  }, []);

  return (
    <Container fluid="sm">
      <h1 className="my-3 d-flex justify-content-between">
        <span className="d-flex align-items-center gap-1">
          <img src="./images/icon128.png" width="40" height="40" />
          <span className="fs-4 fw-bold">はてなミュート</span>
        </span>
        <Form.Check
          checked={allEnabled}
          id="disable-all"
          type="switch"
          onChange={async (event) => {
            setAllEnabled(event.target.checked);
            await userOption.set(STORAGE_KEY.ALL_ENABLED, event.target.checked);
          }}
        />
      </h1>
      <PermissionRequest />
      <div className={allEnabled ? '' : 'opacity-50'}>
        <MuteOptions />
        <LighteningOptions />
      </div>
    </Container>
  );
};

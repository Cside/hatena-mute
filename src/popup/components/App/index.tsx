import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { EVENT_KEY, STORAGE_KEY } from '../../constants';
import { TextFormTab } from '../TextFormTab';
import './styles.scss';

export const App = () => {
  return (
    <Container className="m-2">
      <Tabs defaultActiveKey={EVENT_KEY.NG_DOMAINS}>
        <Tab eventKey={EVENT_KEY.NG_DOMAINS} title="NGサイト">
          <TextFormTab storagekey={STORAGE_KEY.NG_DOMAINS} />
        </Tab>
        <Tab eventKey={EVENT_KEY.NG_WORDS} title="NGワード">
          <TextFormTab storagekey={STORAGE_KEY.NG_WORDS} />
        </Tab>
      </Tabs>
    </Container>
  );
};

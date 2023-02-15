import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { EVENT_KEY, STORAGE_KEY } from '../../constants';
import { TextFormTab } from '../TextFormTab';
import './styles.scss';

export const App = () => {
  return (
    <>
      <Container className="m-2">
        <Tabs defaultActiveKey={EVENT_KEY.NG_URLS}>
          <Tab eventKey={EVENT_KEY.NG_URLS} title="NGサイト">
            <TextFormTab storagekey={STORAGE_KEY.NG_URLS} />
          </Tab>
          <Tab eventKey={EVENT_KEY.NG_WORDS} title="NGワード">
            <TextFormTab storagekey={STORAGE_KEY.NG_WORDS} />
          </Tab>
        </Tabs>
      </Container>

      <div>
        <Form.Check
          type="switch"
          label="ブックマークコメントを見た記事を訪問済みにする"
        />
        <Form.Check type="switch" label="訪問済みの記事を薄くする" />
      </div>
    </>
  );
};

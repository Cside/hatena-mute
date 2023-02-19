import 'bootstrap/scss/bootstrap.scss';
import { Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ACTION } from '../../../constants';
import { EVENT_KEY, STORAGE_KEY } from '../../constants';
import { TextForm } from '../TextForm';
import './styles.scss';

export const App = () => {
  return (
    <Container fluid="sm" className="m-1">
      <div className="py-3">
        <h2>ミュートの設定</h2>
        <Tabs defaultActiveKey={EVENT_KEY.MUTED_SITES}>
          <Tab eventKey={EVENT_KEY.MUTED_SITES} title="サイト">
            <TextForm
              placeholder="example.com"
              storagekey={STORAGE_KEY.MUTED_SITES}
              actionOnChange={ACTION.UPDATE_MUTED_SITES}
            />
          </Tab>
          <Tab eventKey={EVENT_KEY.MUTED_WORDS} title="キーワード">
            <TextForm
              storagekey={STORAGE_KEY.MUTED_WORDS}
              actionOnChange={ACTION.UPDATE_MUTED_WORDS}
            />
          </Tab>
        </Tabs>
      </div>

      <div className="py-3">
        <h2>その他の設定</h2>
        <Form.Check
          id="bs-regards-entry-whose-comments-have-been-visited-as-visited"
          type="switch"
          label="ブックマークコメントを見た記事を訪問済みにする"
        />
        <Form.Check
          id="bs-lightens_visited_entry"
          type="switch"
          label="訪問済みの記事を薄くする"
        />
      </div>
    </Container>
  );
};

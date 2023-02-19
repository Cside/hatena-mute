import 'bootstrap/scss/bootstrap.scss';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ACTION, STORAGE_KEY } from '../../../constants';
import { EVENT_KEY } from '../../constants';
import { CheckForm } from '../CheckForm';
import { MutedListForm } from '../MutedListForm';
import './styles.scss';

export const App = () => {
  return (
    <Container fluid="sm" className="m-1">
      <div className="py-3">
        <h2>ミュートの設定</h2>
        <Tabs defaultActiveKey={EVENT_KEY.MUTED_SITES}>
          <Tab eventKey={EVENT_KEY.MUTED_SITES} title="サイト">
            <MutedListForm
              placeholder="example.com"
              storageKey={STORAGE_KEY.MUTED_SITES}
              actionOnChange={ACTION.UPDATE_MUTED_SITES}
            />
          </Tab>
          <Tab eventKey={EVENT_KEY.MUTED_WORDS} title="キーワード">
            <MutedListForm
              storageKey={STORAGE_KEY.MUTED_WORDS}
              actionOnChange={ACTION.UPDATE_MUTED_WORDS}
            />
          </Tab>
        </Tabs>
      </div>

      <div className="py-3">
        <h2>その他の設定</h2>
        {/* TODO: use clasName of CSS Modules */}
        <CheckForm
          id="bs-regards-entry-whose-comments-have-been-visited-as-visited"
          label="ブックマークコメントを見た記事を訪問済みにする"
          defaultChecked={false}
          storageKey={
            STORAGE_KEY.REGARDS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED_AS_VISITED
          }
        />
        <CheckForm
          id="bs-lightens-visited-entry"
          label="訪問済みの記事を薄くする"
          defaultChecked={false}
          storageKey={STORAGE_KEY.LIGHTENS_VISITED_ENTRY}
        />
      </div>
    </Container>
  );
};

import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ACTION, STORAGE_KEY } from '../../../constants';
import { EVENT_KEY } from '../../constants';
import { CheckForm } from '../CheckForm';
import { MutedListForm } from '../MutedListForm';
import './bootstrap.scss';
import './styles.scss';

export const App = () => {
  const [lightensVisitedEntryIsChecked, setLightensVisitedEntryIsChecked] =
    useState(false);
  const [
    lightensEntryWhoseCommentsHaveBeenVisited,
    setLightensEntryWhoseCommentsHaveBeenVisited,
  ] = useState(false);

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
              description="URL は部分一致で表示されなくなります"
            />
          </Tab>
          <Tab eventKey={EVENT_KEY.MUTED_WORDS} title="キーワード">
            <MutedListForm
              storageKey={STORAGE_KEY.MUTED_WORDS}
              actionOnChange={ACTION.UPDATE_MUTED_WORDS}
              description="大文字小文字は区別されません"
            />
          </Tab>
        </Tabs>
      </div>

      <div className="py-3">
        <h2>その他の設定</h2>
        <CheckForm
          id="hm-lightens-visited-entry"
          label="訪問済みの記事を目立たなくする"
          storageKey={STORAGE_KEY.LIGHTENS_VISITED_ENTRY}
          checked={lightensVisitedEntryIsChecked}
          setChecked={setLightensVisitedEntryIsChecked}
          actionOnChange={ACTION.UPDATE_LIGHTENING_OPTIONS}
        />
        {lightensVisitedEntryIsChecked && (
          <CheckForm
            id="hm-ligntens-entry-whose-comments-have-been-visited"
            label="ブックマークコメントページを訪問済みの記事を目立たなくする"
            storageKey={
              STORAGE_KEY.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED
            }
            checked={lightensEntryWhoseCommentsHaveBeenVisited}
            setChecked={setLightensEntryWhoseCommentsHaveBeenVisited}
            actionOnChange={ACTION.UPDATE_LIGHTENING_OPTIONS}
          />
        )}
      </div>
    </Container>
  );
};

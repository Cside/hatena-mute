import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ACTION, STORAGE_KEY } from '../../../constants';
import { EVENT_KEY } from '../../constants';
import { MutedListForm } from '../MutedListForm';

export const MuteOptions = () => {
  return (
    <div className="pb-3">
      <Tabs defaultActiveKey={EVENT_KEY.MUTED_SITES}>
        <Tab eventKey={EVENT_KEY.MUTED_SITES} title="URL">
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
  );
};

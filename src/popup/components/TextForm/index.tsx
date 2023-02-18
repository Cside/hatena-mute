import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { storage } from '../../../storage';

export const TextForm = ({
  storagekey,
  actionOnChange,
}: {
  storagekey: StorageKey;
  actionOnChange: Action;
}) => {
  const [text, setText] = useState('');
  const [textInStorage, setTextInStorage] = useState('');

  useEffect(() => {
    (async () => {
      const text = (await storage.getText(storagekey)) ?? '';
      setTextInStorage(text);
      setText(text);
    })();
  }, []);

  return (
    <div>
      <div>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </div>
      <div>
        <Button
          onClick={async () => {
            await storage.setText(storagekey, text);
            setTextInStorage(text);
            chrome.tabs.query(
              { url: 'https://b.hatena.ne.jp/*' },
              async (tabs) => {
                for (const tab of tabs)
                  await chrome.tabs.sendMessage(tab.id ?? 0, {
                    type: actionOnChange,
                  });
              },
            );
          }}
          variant="primary"
          disabled={text === textInStorage}
        >
          リストを更新
        </Button>
      </div>
    </div>
  );
};

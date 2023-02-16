import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { storage } from '../../../storage';

export const TextFormTab = ({
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
    <Container>
      <div>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </div>
      <div>
        <Button
          onClick={() => {
            storage.setText(storagekey, text);
            setTextInStorage(text);
            chrome.tabs.query({ url: 'https://b.hatena.ne.jp/*' }, (tabs) => {
              console.log(tabs);
              for (const tab of tabs)
                chrome.tabs.sendMessage(tab.id ?? 0, { type: actionOnChange });
            });
          }}
          variant="primary"
          disabled={text === textInStorage}
        >
          リストを更新
        </Button>
      </div>
    </Container>
  );
};

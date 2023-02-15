import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { storage } from '../../../storage';

export const TextFormTab = ({ storagekey }: { storagekey: StorageKey }) => {
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
            chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
              const activeTab = tabs[0];
              if (!activeTab) {
                throw new Error('Active tab is not found');
              }
              chrome.tabs.sendMessage(activeTab.id ?? 0, {});
            });
          }}
          variant="primary"
          disabled={text === textInStorage}
        >
          更新
        </Button>
      </div>
    </Container>
  );
};

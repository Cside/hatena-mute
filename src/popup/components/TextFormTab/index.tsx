import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export const TextFormTab = ({ storagekey }: { storagekey: StorageKey }) => {
  const [text, setText] = useState('');
  const [textInStorage, setTextInStorage] = useState('');

  useEffect(() => {
    (async () => {
      const text =
        (await chrome.storage.local.get(storagekey))[storagekey] ?? '';
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
            chrome.storage.local.set({
              [storagekey]: text,
            });
            setTextInStorage(text);
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

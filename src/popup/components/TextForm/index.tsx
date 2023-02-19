import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { storage } from '../../../storage';

export const TextForm = ({
  storageKey,
  actionOnChange,
  placeholder,
}: {
  storageKey: StorageKey;
  actionOnChange: Action;
  placeholder?: string;
}) => {
  const [text, setText] = useState('');
  const [textInStorage, setTextInStorage] = useState('');

  useEffect(() => {
    (async () => {
      const text = await storage.getText(storageKey);
      if (text !== undefined) {
        setTextInStorage(text);
        setText(text);
      }
    })();
  }, []);

  return (
    <div>
      <textarea
        className="w-100 block"
        style={{ height: '130px' }}
        value={text}
        {...(placeholder && { placeholder })}
        onChange={(event) => setText(event.target.value)}
      />
      <Form.Check type="switch" id="bs-uses-regexp-for-mute">
        <Form.Check.Input type="checkbox" />
        <Form.Check.Label>
          正規表現を使う
          <Form.Text muted>（大文字/小文字の区別なし）</Form.Text>
        </Form.Check.Label>
      </Form.Check>

      <Button
        className="block"
        onClick={async () => {
          await storage.setText(storageKey, text);
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
  );
};

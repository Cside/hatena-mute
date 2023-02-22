import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { mutedList } from '../../../userOption/mutedList';
import { executeActionOnContenScripts } from '../../utils';

export const MutedListForm = ({
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
      const text = await mutedList.getText(storageKey);
      setTextInStorage(text);
      setText(text);
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
          <Form.Text muted>
            ❌大文字小文字が区別できればreである必要性なし、全角半角も一緒にしたい
          </Form.Text>
        </Form.Check.Label>
      </Form.Check>

      <Button
        className="block"
        onClick={async () => {
          await mutedList.setText(storageKey, text);
          setTextInStorage(text);
          await executeActionOnContenScripts(actionOnChange);
        }}
        variant="primary"
        disabled={text === textInStorage}
      >
        リストを更新
      </Button>
    </div>
  );
};

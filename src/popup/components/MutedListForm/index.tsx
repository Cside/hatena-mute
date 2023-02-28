import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { userOption } from '../../../userOption';
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
      const text = await userOption.text.getPlain(storageKey);
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
      </Form.Check>

      <Button
        className="block"
        onClick={async () => {
          await userOption.text.setPlain(storageKey, text);
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

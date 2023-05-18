import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import type { Action, StorageKey } from '../../../types';
import { userOption } from '../../../userOption';
import { executeActionOnContentScripts } from '../../utils';

export const MutedListForm = ({
  storageKey,
  actionOnChange,
  placeholder,
  description,
}: {
  storageKey: StorageKey;
  actionOnChange: Action;
  placeholder?: string;
  description?: string;
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
      {description !== undefined && (
        <div className="py-1">
          <Form.Text className="text-muted">※ {description}</Form.Text>
        </div>
      )}
      <textarea
        className="w-100 block"
        style={{ height: '130px' }}
        value={text}
        {...(placeholder && { placeholder })}
        onChange={(event) => setText(event.target.value)}
      />

      <Button
        className="block"
        onClick={async () => {
          await userOption.text.setPlain(storageKey, text);
          setTextInStorage(text);
          await executeActionOnContentScripts(actionOnChange);
        }}
        variant="primary"
        disabled={text === textInStorage}
      >
        リストを更新
      </Button>
    </div>
  );
};

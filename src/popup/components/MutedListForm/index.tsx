import type { Action, StorageKey } from '../../../types';

import { memo, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { storage } from '../../../storage';
import { executeActionInContentScripts } from '../../utils';

export const MutedListForm = memo(
  ({
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
        const text = await storage.multiLineText.getWhole(storageKey);
        setTextInStorage(text);
        setText(text);
      })();
    }, []);

    return (
      <div>
        {description !== undefined && (
          <div className="py-1">
            <Form.Text className="text-muted" style={{ fontSize: '0.78rem' }}>
              ※ {description}
            </Form.Text>
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
            await storage.multiLineText.setWhole(storageKey, text);
            setTextInStorage(text);
            await executeActionInContentScripts(actionOnChange);
          }}
          variant="primary"
          disabled={text === textInStorage}
        >
          リストを更新
        </Button>
      </div>
    );
  },
);

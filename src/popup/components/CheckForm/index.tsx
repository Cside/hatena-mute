import type { Action, SetState, StorageKey } from '../../../types';

import { memo, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { storage } from '../../../storage';
import { executeActionInContentScripts } from '../../utils';

export const CheckForm = memo(
  ({
    id,
    label,
    storageKey,
    checked,
    setChecked,
    actionOnChange,
  }: {
    id: string;
    label?: string;
    storageKey: StorageKey;
    checked: boolean;
    setChecked: SetState<boolean>;
    actionOnChange: Action;
  }) => {
    useEffect(() => {
      (async () => {
        const checked = await storage.get<boolean>(storageKey);
        if (checked !== undefined) setChecked(checked);
      })();
    }, []);

    return (
      <Form.Check
        checked={checked}
        id={id}
        type="switch"
        {...(label && { label })}
        onChange={async (event) => {
          const value = event.target.checked;
          await storage.set(storageKey, value);
          setChecked(value);
          await executeActionInContentScripts(actionOnChange);
        }}
      />
    );
  },
);

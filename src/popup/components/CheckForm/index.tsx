import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { userOption } from '../../../userOption';
import { executeActionOnContenScripts } from '../../utils';

export const CheckForm = ({
  id,
  label,
  storageKey,
  checked,
  setChecked,
  actionOnChange,
}: {
  id: string;
  label: string;
  storageKey: UserOptionsStorageKey;
  checked: boolean;
  setChecked: SetState<boolean>;
  actionOnChange: Action;
}) => {
  useEffect(() => {
    (async () => {
      const checked = await userOption.get(storageKey);
      if (checked !== undefined) setChecked(checked);
    })();
  }, []);

  return (
    <Form.Check
      checked={checked}
      id={id}
      type="switch"
      label={label}
      onChange={async (event) => {
        const value = event.target.checked;
        await userOption.set(storageKey, value);
        setChecked(value);
        await executeActionOnContenScripts(actionOnChange);
      }}
    />
  );
};

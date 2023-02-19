import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { userOption } from '../../../userOption';

export const CheckForm = ({
  id,
  label,
  storageKey,
  defaultChecked,
}: {
  id: string;
  label: string;
  storageKey: UserOptionsStorageKey;
  defaultChecked: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);

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
      }}
    />
  );
};

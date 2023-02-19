import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { storage } from '../../../storage';

export const CheckForm = ({
  id,
  label,
  storageKey,
  defaultChecked,
}: {
  id: string;
  label: string;
  storageKey: string;
  defaultChecked: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);

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
      label={label}
      onChange={async (event) => {
        const value = event.target.checked;
        await storage.set(storageKey, value);
        setChecked(value);
      }}
    />
  );
};

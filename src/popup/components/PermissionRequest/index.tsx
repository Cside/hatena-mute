import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { getOrigin } from '../../../utils';

const PERMISSION = {
  origins: [getOrigin()],
};

export const PermissionRequest = () => {
  const [hasPermitted, setHasPermitted] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      setHasPermitted(await chrome.permissions.contains(PERMISSION));
    })();
  }, []);

  return hasPermitted === false ? (
    <Alert variant="danger" className="mt-2">
      <Alert.Heading>初期設定が未完了です</Alert.Heading>
      <Alert.Link
        href="#"
        onClick={async (
          event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        ) => {
          setHasPermitted(await chrome.permissions.request(PERMISSION));
          event.preventDefault();
        }}
      >
        ここをクリックして、この拡張が b.hatena.ne.jp
        にアクセスする権限を許可してください。
      </Alert.Link>
    </Alert>
  ) : null;
};

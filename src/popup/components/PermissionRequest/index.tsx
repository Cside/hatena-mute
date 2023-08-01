import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';

const PERMISSION = {
  origins: ['https://b.hatena.ne.jp/'],
};

export const PermissionRequest = () => {
  const [isPermitted, setIsPermitted] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      setIsPermitted(await chrome.permissions.contains(PERMISSION));
    })();
  }, []);

  return isPermitted === false ? (
    <Alert variant="danger" className="mt-2">
      <Alert.Heading>初期設定が未完了です</Alert.Heading>
      <Alert.Link
        href="#"
        onClick={async (
          event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        ) => {
          setIsPermitted(await chrome.permissions.request(PERMISSION));
          event.preventDefault();
        }}
      >
        ここをクリックして、この拡張が b.hatena.ne.jp
        にアクセスする権限を許可してください。
      </Alert.Link>
    </Alert>
  ) : null;
};

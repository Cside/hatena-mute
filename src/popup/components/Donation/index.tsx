import { getReviewUrl } from '@cside/browser-extension-utils';
import { useEffect, useRef } from 'react';

import ids from '../../../../ids.json';

export const Donation = () => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (linkRef.current) linkRef.current.href = getReviewUrl(chrome.runtime.id, ids);
  }, []);

  return (
    <>
      <div className="mb-3">
        <p className="lh-sm mb-2">
          <span style={{ fontSize: '0.78rem' }}>
            はてなミュートの開発継続と発展のため、コーヒー1杯分ご寄付いただけますと嬉しいです。
          </span>
        </p>
        <div className="d-flex gap-2">
          <a
            href="https://ko-fi.com/cside?_from=hatena-mute"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-body fw-bold rounded text-decoration-none d-flex align-items-center"
            style={{ backgroundColor: '#ffdd02' }}
          >
            ❤️ 寄付
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            className="p-2 text-body fw-bold border border-dark rounded text-decoration-none d-flex align-items-center"
            ref={linkRef}
          >
            レビューで応援
          </a>
        </div>
      </div>
    </>
  );
};

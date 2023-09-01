export const Footer = () => (
  <>
    <hr className="mt-3" />
    <div className="mb-3">
      <p className="lh-sm mb-2">
        <span style={{ fontSize: '0.78rem' }}>
          はてなミュートの開発継続と発展のため、コーヒー1杯分ご寄付いただけますと嬉しいです。
        </span>
      </p>
      <div className="d-flex gap-2">
        <a
          href="https://ko-fi.com/cside"
          target="_blank"
          rel="noreferrer"
          className="p-2 text-body fw-bold  rounded text-decoration-none"
          style={{ backgroundColor: '#ffdd02' }}
        >
          ❤️ 寄付
        </a>
        <a
          href={
            IS_FIREFOX
              ? 'https://addons.mozilla.org/ja/firefox/addon/%E3%81%AF%E3%81%A6%E3%81%AA%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88/'
              : 'https://chrome.google.com/webstore/detail/agomiblbpgcimbonnfmlcealkjlegbnf/reviews'
          }
          target="_blank"
          rel="noreferrer"
          className="p-2 text-body fw-bold border border-dark rounded text-decoration-none"
        >
          レビューで応援
        </a>
      </div>
    </div>
  </>
);

export const Donation = () => (
  <>
    <div className="mb-3">
      <p className="lh-sm mb-2">
        <span style={{ fontSize: '0.78rem' }}>
          はてなミュートの開発継続と発展のため、コーヒー1杯分ご寄付いただけますと嬉しいです。
        </span>
      </p>
      <div className="d-flex gap-2">
        <a
          href="https://www.buymeacoffee.com/cside?_from=hatena_mute"
          target="_blank"
          rel="noreferrer"
          className="p-2 text-body fw-bold rounded text-decoration-none d-flex align-items-center"
          style={{ backgroundColor: '#ffdd02' }}
        >
          ❤️ 寄付
        </a>
        <a
          href="https://chrome.google.com/webstore/detail/agomiblbpgcimbonnfmlcealkjlegbnf/reviews"
          target="_blank"
          rel="noreferrer"
          className="p-2 text-body fw-bold border border-dark rounded text-decoration-none d-flex align-items-center"
        >
          レビューで応援
        </a>
      </div>
    </div>
  </>
);

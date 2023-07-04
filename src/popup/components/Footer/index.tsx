import { useState } from 'react';

export const Footer = () => {
  const [openFeedback, setOpenFeedback] = useState(false);

  return (
    <>
      <hr className="mt-4" />
      <div className="mb-3">
        <ul className="ps-1 list-inline d-flex gap-1 m-0">
          <li className="list-inline-item">
            <a
              href="#"
              onClick={(event) => {
                setOpenFeedback((prev) => !prev);
                event.preventDefault();
              }}
              className="link-secondary"
            >
              フィードバック
            </a>
          </li>
          <li className="list-inline-item">
            <a
              href="https://chrome.google.com/webstore/detail/agomiblbpgcimbonnfmlcealkjlegbnf/reviews"
              target="_blank"
              rel="noreferrer"
              className="link-secondary"
            >
              レビューで応援
            </a>
          </li>
        </ul>

        {openFeedback && (
          <div>
            {'　'}→ <a href="mailto:cside.story@gmail.com">メール</a> 、
            <a
              href="https://github.com/Cside/hatena-mute/issues"
              target="_blank"
              rel="noreferrer"
            >
              Github Issues
            </a>
          </div>
        )}
      </div>
    </>
  );
};

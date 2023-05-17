import { useState } from 'react';

export const Footer = () => {
  const [openFeedback, setOpenFeedback] = useState(false);
  return (
    <>
      <hr className="mt-4" />
      <ul className="ps-3">
        <li className="my-1">
          <a
            href="#"
            onClick={(event) => {
              setOpenFeedback((prev) => !prev);
              event.preventDefault();
            }}
            className="link-secondary"
          >
            要望・バグ報告
          </a>
          {openFeedback && (
            <>
              <br />
              {'　'}→ <a href="mailto:cside.story@gmail.com">メール</a> 、
              <a
                href="https://github.com/Cside/hatena-mute/issues"
                target="_blank"
                rel="noreferrer"
              >
                Github Issues
              </a>
            </>
          )}
        </li>
        <li className="my-1">
          <a
            href="https://chrome.google.com/webstore/detail/agomiblbpgcimbonnfmlcealkjlegbnf/reviews"
            target="_blank"
            rel="noreferrer"
            className="link-secondary"
          >
            レビューで応援お願いします🙏
          </a>
        </li>
      </ul>
    </>
  );
};

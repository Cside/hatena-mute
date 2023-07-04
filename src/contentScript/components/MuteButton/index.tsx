/** @jsxImportSource jsx-dom */
import { $ } from '../../../utils';

import commonStyles from '../../styles.module.scss';
import './styles.module.scss';

export const MuteButton = () => {
  return (
    <a
      href="#"
      className="mute-button"
      onClick={(event) => {
        if (!(event.target instanceof HTMLElement))
          throw new TypeError(`event.target is not HTMLElement`);

        event.preventDefault();
        event.stopPropagation();

        const parent = event.target.parentElement;
        if (!parent) throw new Error(`muteButton.parentElement doesn't exist`);
        const pulldown = $(parent, '.mute-pulldown');

        pulldown.classList.toggle(commonStyles.displayNone);

        if (!pulldown.classList.contains(commonStyles.displayNone)) {
          const listener = (event: MouseEvent) => {
            if (!(event.target instanceof HTMLElement))
              throw new TypeError(`event.target is not HTMLElement`);

            if (!event.target.closest('.mute-pulldown')) {
              pulldown.classList.add(commonStyles.displayNone);
              document.removeEventListener('click', listener);
            }
          };
          document.addEventListener('click', listener);
        }
      }}
    ></a>
  );
};

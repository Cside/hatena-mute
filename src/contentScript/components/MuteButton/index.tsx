/** @jsxImportSource jsx-dom */
import { $ } from '../../../utils';

import '../../styles.pcss';
import './styles.pcss';

export const MuteButton = () => {
  return (
    <a
      href="#"
      className="hm-mute-button"
      onClick={(event) => {
        if (!(event.target instanceof HTMLElement))
          throw new TypeError(`event.target is not HTMLElement`);

        event.preventDefault();
        event.stopPropagation();

        const parent = event.target.parentElement;
        if (!parent) throw new Error(`muteButton.parentElement doesn't exist`);
        const pulldown = $(parent, '.hm-mute-pulldown');

        pulldown.classList.toggle('hm-display-none');

        // pulldown 意外をクリックされたら消すやつ
        if (!pulldown.classList.contains('hm-display-none')) {
          const listener = (event: MouseEvent) => {
            if (!(event.target instanceof HTMLElement))
              throw new TypeError(`event.target is not HTMLElement`);

            if (!event.target.closest('.hm-mute-pulldown')) {
              pulldown.classList.add('hm-display-none');
              document.removeEventListener('click', listener);
            }
          };
          document.addEventListener('click', listener);
        }
      }}
    ></a>
  );
};

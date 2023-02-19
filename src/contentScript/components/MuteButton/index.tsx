/** @jsxImportSource jsx-dom */
import stylesCommon from '../../styles.module.scss';
import { $ } from '../../utils';
import stylesMutePulldown from '../MutePulldown/styles.module.scss';
import styles from './styles.module.scss';

export const MuteButton = () => {
  return (
    <a
      href="#"
      className={styles.muteButton}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        const parent = (event.target as HTMLElement).parentElement;
        if (!parent) throw new Error(`muteButton.parentElement doesn't exist`);
        const pulldown = $(parent, '.' + stylesMutePulldown.mutePulldown);

        pulldown.classList.toggle(stylesCommon.displayNone);

        if (!pulldown.classList.contains(stylesCommon.displayNone)) {
          const listener = (event: MouseEvent) => {
            if (
              !(event.target as HTMLElement).closest('.' + stylesMutePulldown)
            ) {
              pulldown.classList.add(stylesCommon.displayNone);
              document.removeEventListener('click', listener);
            }
          };
          document.addEventListener('click', listener);
        }
      }}
    ></a>
  );
};

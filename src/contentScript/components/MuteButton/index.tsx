/** @jsxImportSource jsx-dom */
import { $ } from '../../../utils';
import commonStyles from '../../styles.module.scss';
import mutePulldownStyles from '../MutePulldown/styles.module.scss';
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
        const pulldown = $(parent, '.' + mutePulldownStyles.mutePulldown);

        pulldown.classList.toggle(commonStyles.displayNone);

        if (!pulldown.classList.contains(commonStyles.displayNone)) {
          const listener = (event: MouseEvent) => {
            if (
              !(event.target as HTMLElement).closest(
                '.' + mutePulldownStyles.mutePulldown,
              )
            ) {
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

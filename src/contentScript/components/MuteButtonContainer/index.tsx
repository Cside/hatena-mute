/** @jsxImportSource jsx-dom */
import { MuteButton } from '../../components/MuteButton';
import { MutePulldown } from '../../components/MutePulldown';

import styles from './styles.module.pcss';

export const MuteButtonContainer = ({
  domain,
  muteSite,
  muteEntry,
}: {
  domain: string;
  muteSite: (domain: string) => void;
  muteEntry: () => void;
}) => (
  <div className={styles.muteButtonContainer}>
    <MuteButton />
    <MutePulldown domain={domain} muteSite={muteSite} muteEntry={muteEntry} />
  </div>
);

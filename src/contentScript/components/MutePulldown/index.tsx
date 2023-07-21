/** @jsxImportSource jsx-dom */
import '../../styles.pcss';
import styles from './styles.module.pcss';

export const MutePulldown = ({
  domain,
  muteSite,
  muteEntry,
}: {
  domain: string;
  muteSite: (domain: string) => void;
  muteEntry: () => void;
}) => {
  let pathlessDomain: string | undefined = undefined;
  if (domain.includes('/')) pathlessDomain = domain.replace(/\/.+$/, '');

  return (
    <div
      className={`hm-mute-pulldown hm-display-none`}
      style={{
        top: '40px',
        right: '0px',
      }}
    >
      <div className={styles.item} onClick={() => muteSite(domain)}>
        {domain} をミュート
      </div>
      {pathlessDomain && (
        <div
          className={styles.item}
          onClick={() => muteSite(pathlessDomain ?? '')}
        >
          {pathlessDomain} をミュート
        </div>
      )}
      <div className={styles.item} onClick={muteEntry}>
        この記事を非表示
      </div>
    </div>
  );
};

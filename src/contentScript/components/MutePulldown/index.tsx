/** @jsxImportSource jsx-dom */
import commonStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

export const MutePulldown = ({
  domain,
  muteSite,
}: {
  domain: string;
  muteSite: (domain: string) => void;
}) => {
  let pathlessDomain: string | undefined = undefined;
  if (domain.includes('/')) pathlessDomain = domain.replace(/\/.+$/, '');

  return (
    <div
      className={`${styles.mutePulldown} ${commonStyles.displayNone}`}
      style={{
        top: '40px',
        right: '0px',
      }}
    >
      <div onClick={() => muteSite(domain)}>{domain} をミュート</div>
      {pathlessDomain && (
        <div onClick={() => muteSite(pathlessDomain ?? '')}>
          {pathlessDomain} をミュート
        </div>
      )}
      <div>この記事だけを非表示</div>
    </div>
  );
};

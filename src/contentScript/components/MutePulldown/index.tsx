/** @jsxImportSource jsx-dom */
import commonStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

export const MutePulldown = ({
  domain,
  onClick,
}: {
  domain: string;
  onClick: (event: MouseEvent) => void;
}) => {
  return (
    <div
      className={`${styles.mutePulldown} ${commonStyles.displayNone}`}
      style={{
        top: '40px',
        right: '0px',
      }}
      onClick={onClick}
    >
      <div className="mute-site">{domain} をミュート</div>
      {domain.includes('/') && (
        <div className="mute-site">
          {domain.replace(/\/.+$/, '')} をミュート
        </div>
      )}
      <div>この記事だけを非表示</div>
    </div>
  );
};

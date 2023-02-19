/** @jsxImportSource jsx-dom */
import stylesCommon from '../../styles.module.scss';
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
      className={`${styles.mutePulldown} ${stylesCommon.displayNone}`}
      style={{
        top: '40px',
        right: '0px',
      }}
      onClick={onClick}
    >
      <div className="mute-site">{domain} をミュートする</div>
      <div>この記事を非表示にする</div>
    </div>
  );
};

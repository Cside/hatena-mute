import { useState } from 'react';
import { ACTION, STORAGE_KEY } from '../../../constants';
import { CheckForm } from '../CheckForm';

import './styles.scss';

export const LighteningOptions = () => {
  const [lightensVisitedEntryIsChecked, setLightensVisitedEntryIsChecked] =
    useState(false);
  const [
    lightensEntryWhoseCommentsHaveBeenVisited,
    setLightensEntryWhoseCommentsHaveBeenVisited,
  ] = useState(false);
  return (
    <div className="py-3">
      <h2>その他の設定</h2>
      <CheckForm
        id="hm-lightens-visited-entry"
        label="訪問済みの記事を目立たなくする"
        storageKey={STORAGE_KEY.LIGHTENS_VISITED_ENTRY}
        checked={lightensVisitedEntryIsChecked}
        setChecked={setLightensVisitedEntryIsChecked}
        actionOnChange={ACTION.UPDATE_LIGHTENING_OPTIONS}
      />
      {lightensVisitedEntryIsChecked && (
        <CheckForm
          id="hm-ligntens-entry-whose-comments-have-been-visited"
          label="ブックマークコメントのページを訪問済みの記事を目立たなくする"
          storageKey={
            STORAGE_KEY.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED
          }
          checked={lightensEntryWhoseCommentsHaveBeenVisited}
          setChecked={setLightensEntryWhoseCommentsHaveBeenVisited}
          actionOnChange={ACTION.UPDATE_LIGHTENING_OPTIONS}
        />
      )}
    </div>
  );
};

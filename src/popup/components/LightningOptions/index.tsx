import { useState } from 'react';
import { ACTION_OF, STORAGE_KEY_OF } from '../../../constants';
import { CheckForm } from '../CheckForm';

import './styles.pcss';

export const LighteningOptions = () => {
  const [lightensVisitedEntryIsChecked, setLightensVisitedEntryIsChecked] = useState(false);
  const [lightensEntryWhoseCommentsHaveBeenVisited, setLightensEntryWhoseCommentsHaveBeenVisited] =
    useState(false);
  return (
    <div>
      <CheckForm
        id="hm-lightens-visited-entry"
        label="訪問済みの記事を目立たなくする"
        storageKey={STORAGE_KEY_OF.LIGHTENS_VISITED_ENTRY}
        checked={lightensVisitedEntryIsChecked}
        setChecked={setLightensVisitedEntryIsChecked}
        actionOnChange={ACTION_OF.UPDATE_LIGHTENING_OPTIONS}
      />
      {lightensVisitedEntryIsChecked && (
        <CheckForm
          id="hm-ligntens-entry-whose-comments-have-been-visited"
          label="ブックマークコメントのページを訪問済みの記事を目立たなくする"
          storageKey={STORAGE_KEY_OF.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED}
          checked={lightensEntryWhoseCommentsHaveBeenVisited}
          setChecked={setLightensEntryWhoseCommentsHaveBeenVisited}
          actionOnChange={ACTION_OF.UPDATE_LIGHTENING_OPTIONS}
        />
      )}
    </div>
  );
};

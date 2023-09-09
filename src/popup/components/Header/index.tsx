import type { SetState } from '../../../types';

import { memo } from 'react';
import { ACTION_OF, STORAGE_KEY_OF } from '../../../constants';
import { CheckForm } from '../CheckForm';

export const Header = memo(
  ({ checked, setChecked }: { checked: boolean; setChecked: SetState<boolean> }) => (
    <h1 className="my-3 d-flex justify-content-between">
      <span className="d-flex align-items-center gap-1">
        <img src="./images/icon128.png" width="40" height="40" />
        <span className="fs-4 fw-bold">はてなミュート</span>
      </span>
      <CheckForm
        id="enable-all"
        storageKey={STORAGE_KEY_OF.IS_EXTENSION_ENABLED}
        checked={checked}
        setChecked={setChecked}
        actionOnChange={ACTION_OF.UPDATE_IS_EXTENSION_ENABLED}
      />
    </h1>
  ),
);

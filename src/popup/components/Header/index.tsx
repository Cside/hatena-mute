import { memo } from 'react';
import { ACTION, STORAGE_KEY } from '../../../constants';
import { SetState } from '../../../types';
import { CheckForm } from '../CheckForm';

export const Header = memo(
  ({
    checked,
    setChecked,
  }: {
    checked: boolean;
    setChecked: SetState<boolean>;
  }) => (
    <h1 className="my-3 d-flex justify-content-between">
      <span className="d-flex align-items-center gap-1">
        <img src="./images/icon128.png" width="40" height="40" />
        <span className="fs-4 fw-bold">はてなミュート</span>
      </span>
      <CheckForm
        id="enable-all"
        storageKey={STORAGE_KEY.ALL_ENABLED}
        checked={checked}
        setChecked={setChecked}
        actionOnChange={ACTION.UPDATE_ALL_ENABLED}
      />
    </h1>
  ),
);

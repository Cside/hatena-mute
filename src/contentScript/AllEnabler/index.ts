import { STORAGE_KEY } from '../../constants';
import { userOption } from '../../userOption';

export class AllEnabler {
  rootElement: HTMLElement;
  static className = 'is-hatena-mute-enabled';

  constructor({ rootElement }: { rootElement: HTMLElement }) {
    this.rootElement = rootElement;
  }

  async initialize() {
    if (await userOption.get(STORAGE_KEY.ALL_ENABLED))
      this.rootElement.classList.add(AllEnabler.className);
  }

  async update() {
    this.rootElement.classList[
      (await userOption.get(STORAGE_KEY.ALL_ENABLED)) ? 'add' : 'remove'
    ](AllEnabler.className);
  }
}

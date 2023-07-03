import { STORAGE_KEY } from '../../constants';
import { userOption } from '../../userOption';

export class ExtensionEnabler {
  rootElement: HTMLElement;
  static className = 'is-hatena-mute-enabled';

  constructor({ rootElement }: { rootElement: HTMLElement }) {
    this.rootElement = rootElement;
  }

  async initialize() {
    if (await userOption.get(STORAGE_KEY.IS_EXTENSION_ENABLED))
      this.rootElement.classList.add(ExtensionEnabler.className);
  }

  async update() {
    this.rootElement.classList[
      (await userOption.get(STORAGE_KEY.IS_EXTENSION_ENABLED))
        ? 'add'
        : 'remove'
    ](ExtensionEnabler.className);
  }
}

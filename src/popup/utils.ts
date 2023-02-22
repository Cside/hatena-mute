import manifest from '../../manifest.json';

export const executeActionOnContenScripts = async (action: Action) => {
  const url = manifest.content_scripts[0]?.matches;
  if (!url)
    throw new Error(`manifestJson.content_scripts[0].matches is not found`);

  for (const tab of await chrome.tabs.query({ url }))
    await chrome.tabs.sendMessage(tab.id ?? 0, {
      type: action,
    });
};

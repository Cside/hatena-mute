import manifest from '../../manifest.json';

export const executeActionOnContenScripts = async (action: Action) => {
  const url = manifest.content_scripts[0]?.matches;
  if (!url)
    throw new Error(`manifestJson.content_scripts[0].matches is not found`);

  await Promise.all(
    (
      await chrome.tabs.query({ url })
    ).map(async (tab) => {
      try {
        await chrome.tabs.sendMessage(tab.id ?? 0, {
          type: action,
        });
      } catch (error) {
        console.info(
          `Could not establish connection. Maybe old tabs exist since before installation.\n${error}`,
        );
        await chrome.tabs.reload(tab.id ?? 0);
      }
    }),
  );
};

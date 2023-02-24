const hasVisited = async (url: string) =>
  (await chrome.history.getVisits({ url })).length > 0;

export const getVisitedMap = async (urls: string[]) =>
  Object.fromEntries(
    await Promise.all(
      urls.map(
        async (url) => [url, await hasVisited(url)] as [string, boolean],
      ),
    ),
  );

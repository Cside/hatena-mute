export const createElementFromString = <T = HTMLElement>(
  htmlString: string,
) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString;
  return div.firstChild as T;
};

export type Styles = {
  displayNone: string;
  mutedSitesMatched: string;
  mutedWordsMatched: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;

export type Styles = {
  mutedSitesMatched: string;
  mutedWordsMatched: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;

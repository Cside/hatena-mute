export type Styles = {
  mutedEntryMatched: string;
  mutedSitesMatched: string;
  mutedWordsMatched: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;

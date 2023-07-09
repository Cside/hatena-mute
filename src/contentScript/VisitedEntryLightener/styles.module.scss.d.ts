export type Styles = {
  lightensVisitedEntry: string;
  visited: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;

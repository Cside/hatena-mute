export type Styles = {
  styleHeadline: string;
  styleList: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;

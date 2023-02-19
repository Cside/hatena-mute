export type Styles = {
  muteButton: string;
  styleHeadline: string;
  styleList: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;

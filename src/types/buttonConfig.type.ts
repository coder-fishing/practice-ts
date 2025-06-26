export type ButtonConFig = {
  text: string;
  icon: string;
  className: string;
  id?: string;
  type?: "button" | "submit" | "reset";
  link?: string;
  action?: string;
};
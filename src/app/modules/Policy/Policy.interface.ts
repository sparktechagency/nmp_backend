
export type TPolicyType = "privacy-policy" | "about-us" |  "terms-condition" | "help";

export interface IPolicy {
  type: TPolicyType;
  content: string;
};


export interface Tool {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: ToolCategory;
}

export type ToolCategory =
  | "dev"
  | "text"
  | "security"
  | "media"
  | "utility"
  | "fun";

export const categoryLabels: Record<ToolCategory, string> = {
  dev: "Developer Tools",
  text: "Text Tools",
  security: "Security",
  media: "Media & Image",
  utility: "Utilities",
  fun: "Fun & Games",
};

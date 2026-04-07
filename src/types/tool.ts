export interface Tool {
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
}

export type ToolCategory =
  | "dev"
  | "text"
  | "security"
  | "media"
  | "utility";

export const categoryLabels: Record<ToolCategory, string> = {
  dev: "Developer Tools",
  text: "Text Tools",
  security: "Security",
  media: "Media & Image",
  utility: "Utilities",
};

import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBreakingNewsInputProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  currentContext:WebPartContext;
}

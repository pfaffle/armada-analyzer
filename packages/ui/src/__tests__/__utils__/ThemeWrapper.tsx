import { Provider } from "@/components/ui/provider";

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider>{children}</Provider>
);

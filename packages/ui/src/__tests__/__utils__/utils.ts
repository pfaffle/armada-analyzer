import { ThemeWrapper } from "./ThemeWrapper";
import { render as baseRender, RenderOptions } from "@testing-library/react";

export const renderWithTheme = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => baseRender(ui, { wrapper: ThemeWrapper, ...options });

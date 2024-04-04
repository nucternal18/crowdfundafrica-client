import { ThirdwebProvider } from "thirdweb/react";

import { StateContextProvider } from "./state-context-provider";
import { ThemeProvider } from "./theme-provider";




export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <StateContextProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
      </StateContextProvider>
    </ThirdwebProvider>
  );
}

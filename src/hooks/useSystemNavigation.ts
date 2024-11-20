import { useContext } from "react";
import { SystemNavigationContext } from "../provider/SystemNavigationProvider";
import { ContextType } from "../types/Context";
import { SystemNavigationType } from "../types/SystemNavigation";

export const useSystemNavigation = (): ContextType<SystemNavigationType> => {
  const context = useContext(SystemNavigationContext);
  if (!context)
    throw new Error("useSystem must be used within a SystemProvider");

  return context;
};

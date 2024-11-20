import { SystemContext } from "../provider/SystemProvider";
import { useProvider } from "../hooks/useProvider";

export const useSystem = () => useProvider(SystemContext, "System");

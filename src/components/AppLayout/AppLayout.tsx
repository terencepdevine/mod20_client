import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import Header from "../Header/Header";
import { useTheme } from "../../contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { getSystem } from "../../services/apiSystem";

import "./AppLayout.scss";
import ScrollToHashElement from "../../utils/ScrollToHashElement";

const AppLayout: React.FC = () => {
  const { systemSlug } = useParams();
  const { setBackgroundColorFamily, setPrimaryColorFamily, isPreviewMode } = useTheme();

  // Fetch system data when systemSlug is available
  const { data: system } = useQuery({
    queryKey: ['system', systemSlug],
    queryFn: () => getSystem(systemSlug!),
    enabled: !!systemSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update color families when system data changes (but not during preview mode)
  useEffect(() => {
    if (!isPreviewMode) {
      if (system?.backgroundColorFamily) {
        setBackgroundColorFamily(system.backgroundColorFamily as any);
      } else if (systemSlug && !system?.backgroundColorFamily) {
        // Reset to default if system exists but has no background color family
        setBackgroundColorFamily('gray');
      }

      if (system?.primaryColorFamily) {
        setPrimaryColorFamily(system.primaryColorFamily as any);
      } else if (systemSlug && !system?.primaryColorFamily) {
        // Reset to default if system exists but has no primary color family
        setPrimaryColorFamily('blue');
      }
    }
  }, [system, systemSlug, setBackgroundColorFamily, setPrimaryColorFamily, isPreviewMode]);

  return (
    <>
      <ScrollToHashElement />
      <div className="app-layout">
        <Header />
        <Outlet />
      </div>
    </>
  );
};

export default AppLayout;

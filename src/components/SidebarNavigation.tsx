import { useSystemNavigation } from "../hooks/useSystemNavigation";
import { SystemNavigationItemType } from "../types/SystemNavigation";
import { SidebarNavigationItem } from "./SidebarNavigationItem";

const SidebarNavigation: React.FC = () => {
  const { data, isPending, isError, error } = useSystemNavigation();
  const { navigation, systemId } = data;
  console.log(data);

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  return (
    <nav className="relative z-10">
      <ul>
        {navigation.map((item: SystemNavigationItemType) => {
          return (
            <SidebarNavigationItem
              key={item.slug}
              name={item.name}
              slug={item.slug}
              systemId={systemId}
              children={item.children}
            />
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;

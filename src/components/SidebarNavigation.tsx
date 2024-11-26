import { useSystemNavigation } from "../hooks/useProvider";
import { SystemNavigationItemType } from "../types/SystemNavigation";
import { SidebarNavigationItem } from "./SidebarNavigationItem";

const SidebarNavigation: React.FC = () => {
  const { data, isPending, isError, error } = useSystemNavigation();
  const navigation = data?.navigation;
  const systemId = data?.systemId;

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!navigation || !systemId)
    return (
      <div>
        <h1>Error Will Robinson!</h1>
      </div>
    );

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

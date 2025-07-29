import { useSystemNavigation } from "../../hooks/useProvider";
import SidebarNavigationItem from "./SidebarNavigationItem";

const SidebarNavigation: React.FC = () => {
  const { data, isPending, isError, error } = useSystemNavigation();
  const navigation = data?.navigation;
  const systemSlug = data?.systemSlug;

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!data) {
    return <div>Error: Navigation data is missing.</div>;
  }

  return (
    <nav className="nav-sidebar">
      <ul className="nav-sidebar__list">
        {navigation?.map((item, index) => (
          <SidebarNavigationItem
            systemSlug={systemSlug || ""}
            item={item}
            key={index}
          />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;

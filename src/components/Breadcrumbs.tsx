import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useContext } from "react";
import { SystemNavigationContext } from "../provider/SystemNavigationProvider";
import { SystemNavigationType } from "../types/SystemNavigation";

const Breadcrumbs: React.FC = () => {
  const navigation = useContext(
    SystemNavigationContext,
  ) as SystemNavigationType;

  return (
    <ul className="relative z-10 flex items-center gap-2">
      {navigation.system && (
        <BreadcrumbsItem name={navigation.system} index={0} />
      )}
      {/* {list.map((item, i) => (
        <BreadcrumbsItem name={item.name} index={i} key={i} />
      ))} */}
    </ul>
  );
};

type BreadcrumbsItemProps = {
  name: string;
  index: number;
};

const BreadcrumbsItem: React.FC<BreadcrumbsItemProps> = ({ name, index }) => {
  return (
    <li className="flex items-center gap-2 text-gray-400">
      {index !== 0 && <ChevronRightIcon className="h-4 w-4 opacity-50" />}
      <a href="#" className="text-sm text-gray-400 lg:text-base">
        {name}
      </a>
    </li>
  );
};

export default Breadcrumbs;

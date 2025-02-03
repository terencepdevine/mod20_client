import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useSystemNavigation } from "../hooks/useProvider";
import { Link } from "react-router-dom";

const Breadcrumbs: React.FC = () => {
  const { data } = useSystemNavigation();
  const name = data?.system;
  // const navigation = useContext(
  //   SystemNavigationContext,
  // ) as SystemNavigationType;
  // const { data: system, isPending, isError, error } = useSystem();

  return (
    <ul className="relative z-10 flex items-center gap-2">
      {name && (
        <BreadcrumbsItem
          name={name}
          index={0}
          to={`/systems/${data.systemId}`}
        />
      )}
      {/* {list.map((item, i) => (
        <BreadcrumbsItem name={item.name} index={i} key={i} />
      ))} */}
    </ul>
  );
};

type BreadcrumbsItemProps = {
  name: string;
  to: string;
  index: number;
};

const BreadcrumbsItem: React.FC<BreadcrumbsItemProps> = ({
  name,
  to,
  index,
}) => {
  return (
    <li className="flex items-center gap-2 text-gray-400">
      {index !== 0 && <ChevronRightIcon className="h-4 w-4 opacity-50" />}
      <Link to={to} className="text-sm text-gray-400 lg:text-base">
        {name}
      </Link>
    </li>
  );
};

export default Breadcrumbs;

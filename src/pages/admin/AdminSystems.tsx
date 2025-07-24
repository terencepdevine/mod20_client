import { Link, useLoaderData } from "react-router-dom";
import { SystemType } from "@mod20/types";

const AdminSystems: React.FC = () => {
  const systems = useLoaderData() as SystemType[];

  return (
    <>
      <h1>Systems</h1>
      <ul>
        {systems.map((system) => {
          return (
            <li key={system.id}>
              <Link to={`/admin/systems/${system.slug}`}>{system.name}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default AdminSystems;

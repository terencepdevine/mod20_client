import { Link, useLoaderData } from "react-router-dom";
import { System } from "@mod20/types";

const AdminSystems: React.FC = () => {
  const systems = useLoaderData() as System[];

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

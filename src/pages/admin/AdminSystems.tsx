import { Link, useLoaderData } from "react-router-dom";
import { System } from "../../types/System";

const AdminSystems: React.FC = () => {
  const systems = useLoaderData() as System[];

  return (
    <>
      <h1>Systems</h1>
      <ul>
        {systems.map((system) => {
          return (
            <li>
              <Link to={`/admin/systems/${system.id}`}>{system.name}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default AdminSystems;

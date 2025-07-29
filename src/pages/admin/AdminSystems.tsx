import { Link, useLoaderData } from "react-router-dom";
import { SystemType } from "@mod20/types";
import Button from "../../components/Button/Button";

const AdminSystems: React.FC = () => {
  const systems = useLoaderData() as SystemType[];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1>Systems</h1>
        <Button to="/admin/systems/new" type="link">
          Create System
        </Button>
      </div>
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

import { useLoaderData, useParams } from "react-router-dom";
import { Role } from "../types/Role";

const Roles: React.FC = () => {
  const { systemId } = useParams();

  return (
    <>
      <div className="p-6">
        <h1>System ID: {systemId}</h1>
        <RolesContent />
      </div>
    </>
  );
};

const RolesContent: React.FC = () => {
  const roles = useLoaderData() as Role[];
  console.log(roles);

  return (
    <div>
      <h1>Role Content</h1>
    </div>
  );
};

export default Roles;

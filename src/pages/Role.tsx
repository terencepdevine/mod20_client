import { RoleProvider } from "../provider/RoleProvider";
import Hero from "../components/Hero";
import { useRole } from "../hooks/useProvider";
import { useParams } from "react-router-dom";
import { Role as RoleType } from "../types/Role";
import { RoleWithBreadcrumbs } from "../services/apiSystem";

const Role: React.FC = () => {
  const { systemId, roleId } = useParams();

  return (
    <RoleProvider systemId={systemId as string} roleId={roleId as string}>
      <RoleContent />
    </RoleProvider>
  );
};

const RoleContent: React.FC = () => {
  const { data, isPending, isError, error } = useRole<RoleWithBreadcrumbs>();
  const role = data?.role as RoleType;

  console.log(data);

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!data) {
    console.error("RaceContext is null");
    return <div>Error: Role data is missing.</div>;
  }

  return (
    <div className="flex-1">
      <Hero name={role.name} />
      <div className="prose p-6">
        {role.introduction && (
          <blockquote
            dangerouslySetInnerHTML={{ __html: role.introduction as string }}
          ></blockquote>
        )}
      </div>
    </div>
  );
};

export default Role;

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Button from "../../components/Button/Button";
import Loading from "../../components/Loading/Loading";
import { getSystems } from "../../services/apiSystem";

const AdminSystems: React.FC = () => {
  const { data: systems, isPending, isError, error } = useQuery({
    queryKey: ["systems"],
    queryFn: getSystems,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus to reduce flashing
  });

  // Only show loading if we don't have any data at all
  if (isPending && !systems) {
    return <Loading message="Loading systems..." className="content-wrap" />;
  }

  if (isError) {
    return (
      <div className="content-wrap">
        <div className="error-message">
          Error: {error?.message || "Failed to load systems"}
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrap" style={{ minHeight: '200px' }}>
      <div className="flex justify-between items-center mb-4">
        <h1>Systems</h1>
        <Button to="/admin/systems/new" type="link">
          Create System
        </Button>
      </div>
      <ul>
        {systems?.map((system) => {
          return (
            <li key={system.id}>
              <Link to={`/admin/systems/${system.slug}`}>{system.name}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminSystems;

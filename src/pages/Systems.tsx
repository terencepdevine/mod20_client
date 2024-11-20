import { Link, useLoaderData } from "react-router-dom";
import { System as SystemType } from "../types/System";
import { SystemProvider } from "../provider/SystemProvider";
import { useSystem } from "../hooks/useProvider";

const System: React.FC = () => {
  const systems = useLoaderData() as SystemType[];

  return (
    <>
      <div className="flex flex-col p-8">
        <h1 className="text-3xl">Systems</h1>
        {systems.map((system) => {
          return (
            <SystemProvider systemId={system.id}>
              <SystemBlock />
            </SystemProvider>
          );
        })}
      </div>
    </>
  );
};

export default System;

const SystemBlock: React.FC = () => {
  const { data: system } = useSystem();

  if (!system) {
    console.error("System Context is Null");
    return <div>Error: System data is missing</div>;
  }

  const { name } = system;

  return <Link to={`/systems/${system.id}`}>{name}</Link>;
};

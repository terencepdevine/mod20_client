import { useParams } from "react-router-dom";
import { SystemProvider } from "../provider/SystemProvider";
import { useSystem } from "../hooks/useProvider";
import Hero from "../components/Hero";

const System: React.FC = () => {
  const { systemId } = useParams();

  if (!systemId) {
    return <h1>Error: Missing system ID</h1>;
  }

  return (
    <SystemProvider systemId={systemId as string}>
      <SystemContent />
    </SystemProvider>
  );
};

const SystemContent: React.FC = () => {
  const { data: system, isPending, isError, error } = useSystem();
  const { introduction } = system;

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!system) {
    console.error("System Context is null");
    return <div>Error: System data is missing.</div>;
  }

  return (
    <main className="h-full flex-1 overflow-hidden overflow-y-auto">
      <Hero name={system.name} />
      <div className="prose p-6">
        {introduction && (
          <blockquote
            dangerouslySetInnerHTML={{ __html: introduction as string }}
          ></blockquote>
        )}
      </div>
    </main>
  );
};

export default System;

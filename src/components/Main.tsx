import Hero from "./Hero";
import { useSystem } from "../hooks/useProvider";

const Main: React.FC = () => {
  const { data: system, isPending, isError, error } = useSystem();
  const name = system?.name as string;
  const introduction = system?.introduction as string;

  if (!system) {
    console.error("System Context is null");
    return <div>Error: System data is missing.</div>;
  }

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  return (
    <main className="h-full flex-1 overflow-hidden overflow-y-auto">
      <Hero name={name} />
      <div className="relative grid grid-cols-3 gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="absolute left-0 top-0 z-[-1] h-[400px] w-full bg-[radial-gradient(ellipse_at_top,var(--color-sky-800)_0%,var(--color-gray-950)_70%)] opacity-10"></div>
        <div className="prose col-span-2">
          {introduction && (
            <blockquote
              className="order-2 col-span-3 max-w-none sm:order-1 sm:col-span-2"
              dangerouslySetInnerHTML={{ __html: introduction as string }}
            ></blockquote>
          )}
        </div>
        <div className="relative z-10 order-1 col-span-3 flex flex-col gap-8 sm:order-2 sm:col-span-1">
          <h1>Sidebar</h1>
        </div>
      </div>
    </main>
  );
};

export default Main;

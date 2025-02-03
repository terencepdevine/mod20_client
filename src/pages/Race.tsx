import { useParams } from "react-router-dom";
import { useRace } from "../hooks/useProvider";
import { RaceProvider } from "../provider/RaceProvider";

import Hero from "../components/Hero";

const Race: React.FC = () => {
  const { systemId, raceId } = useParams();

  return (
    <RaceProvider systemId={systemId as string} raceId={raceId as string}>
      <RaceContent />
    </RaceProvider>
  );
};

const RaceContent: React.FC = () => {
  const { data: race, isPending, isError, error } = useRace();
  const name = race?.name as string;

  if (!race) {
    console.error("RaceContext is null");
    return <div>Error: Race data is missing.</div>;
  }

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  return (
    <div className="flex-1">
      <Hero name={name} />
    </div>
  );
};

export default Race;

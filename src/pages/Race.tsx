import { RaceType } from "@mod20/types";
import { useParams } from "react-router-dom";
import { useRace } from "../hooks/useProvider";
import { RaceProvider } from "../provider/RaceProvider";
import Hero from "../components/Hero/Hero";

const Race: React.FC = () => {
  const { systemSlug, sectionSlug } = useParams();

  return (
    <RaceProvider
      systemSlug={systemSlug as string}
      sectionSlug={sectionSlug as string}
    >
      <RaceContent />
    </RaceProvider>
  );
};

const RaceContent: React.FC = () => {
  const { data, isPending, isError, error } = useRace();
  const race = data as RaceType;

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!data) {
    console.error("RaceContext is null");
    return <div>Error: Role data is missing.</div>;
  }

  return (
    <div className="content-wrap">
      <Hero name={race.name} />
      <div className="content">
        <div className="content__main wysiwyg">
          {race.size && (
            <div className="text-lg">
              <p>{race.size}</p>
            </div>
          )}
          {race.alignment && (
            <p>
              <strong>Alignment:</strong> {race.alignment.value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Race;

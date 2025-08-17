import { RaceType, ImageType } from "@mod20/types";
import { useParams, Link } from "react-router-dom";

import { useRace, useSystem } from "../../hooks/useProvider";
import { useEntityImages } from "../../hooks/useImages";
import { RaceProvider } from "../../provider/RaceProvider";
import { SystemProvider } from "../../provider/SystemProvider";
import Hero from "../../components/Hero/Hero";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import Card from "../../components/Card/Card";
import { getImageUrl } from "../../utils/imageUtils";
import "./Race.scss";

const Race: React.FC = () => {
  const { systemSlug, sectionSlug } = useParams();

  return (
    <SystemProvider systemSlug={systemSlug as string}>
      <RaceProvider
        systemSlug={systemSlug as string}
        sectionSlug={sectionSlug as string}
      >
        <RaceContent />
      </RaceProvider>
    </SystemProvider>
  );
};

const RaceContent: React.FC = () => {
  const { data, isPending, isError, error } = useRace();
  const { data: systemData } = useSystem();
  const race = data as RaceType;

  const { galleryImages, backgroundImageUrl: raceBackgroundUrl, galleryImageUrls } = useEntityImages(race);
  const { backgroundImageUrl: systemBackgroundUrl } = useEntityImages(systemData);


  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!data) {
    return <div>Error: Race data is missing.</div>;
  }

  const hasSpeedData = race.speedWalking || race.speedFlying || race.speedSwimming || race.speedClimbing || race.speedBurrowing;
  
  // Try race background first, then system background as fallback
  const backgroundImageUrl = raceBackgroundUrl || systemBackgroundUrl;


  return (
    <div className="content-wrap">
      <Hero name={race.name} backgroundImage={backgroundImageUrl} />
      <div className="content">
        <div className="content__main wysiwyg">
          {race.introduction && (
            <div
              className="race-introduction"
              dangerouslySetInnerHTML={{ __html: race.introduction }}
            />
          )}
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
          {hasSpeedData && (
            <div className="race-speeds" id="speeds">
              <h3>Speed</h3>
              {race.speedWalking && (
                <p><strong>Walking:</strong> {race.speedWalking} feet</p>
              )}
              {race.speedFlying && (
                <p><strong>Flying:</strong> {race.speedFlying} feet</p>
              )}
              {race.speedSwimming && (
                <p><strong>Swimming:</strong> {race.speedSwimming} feet</p>
              )}
              {race.speedClimbing && (
                <p><strong>Climbing:</strong> {race.speedClimbing} feet</p>
              )}
              {race.speedBurrowing && (
                <p><strong>Burrowing:</strong> {race.speedBurrowing} feet</p>
              )}
            </div>
          )}
          {race.age && (
            <div className="race-age" id="age">
              <p><strong>Age:</strong> {race.age} years</p>
            </div>
          )}
          {race.traits && race.traits.length > 0 && (
            <div className="race-traits" id="traits">
              <h3>{race.name} Traits</h3>
              {race.traits.map((trait, index) => (
                <div key={trait.id || index} className="trait-item">
                  <Card>
                    <h4>{trait.name}</h4>
                    {trait.description && (
                      <div
                        className="trait-description"
                        dangerouslySetInnerHTML={{ __html: trait.description }}
                      />
                    )}
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="content__sidebar">
          {galleryImageUrls.length > 0 && (
            <ImageGallery
              images={galleryImageUrls}
              basePath=""
              alt={`${race.name} images`}
            />
          )}
          <div className="nav-page-wrap">
            <nav className="nav-page">
              <h4>On This Page</h4>
              <ul className="nav-page__list">
                <li className="nav-page__item">
                  <Link to="#alignment" className="nav-page__link">
                    Alignment
                  </Link>
                </li>
                {hasSpeedData && (
                  <li className="nav-page__item">
                    <Link to="#speeds" className="nav-page__link">
                      Speed
                    </Link>
                  </li>
                )}
                {race.age && (
                  <li className="nav-page__item">
                    <Link to="#age" className="nav-page__link">
                      Age
                    </Link>
                  </li>
                )}
                {race.traits && race.traits.length > 0 && (
                  <li className="nav-page__item">
                    <Link to="#traits" className="nav-page__link">
                      Traits
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Race;

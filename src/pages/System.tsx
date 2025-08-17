import { useParams } from "react-router-dom";
import { SystemProvider } from "../provider/SystemProvider";
import { useSystem } from "../hooks/useProvider";
import Hero from "../components/Hero/Hero";
import Loading from "../components/Loading/Loading";
import { ArmorTaxonomyType, WeaponTaxonomyType, ImageType } from "@mod20/types";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "../services/apiSystem";
import { getImageUrl } from "../utils/imageUtils";
import { getAbilityAbbreviation } from "../utils/formUtils";

const System: React.FC = () => {
  const { systemSlug } = useParams();

  if (!systemSlug) {
    return <h1>Error: Missing system ID</h1>;
  }

  return (
    <SystemProvider systemSlug={systemSlug as string}>
      <SystemContent />
    </SystemProvider>
  );
};

const SystemContent: React.FC = () => {
  const { data: system, isPending, isError, error } = useSystem();

  // Query for media library images to resolve Image IDs
  const { data: allImages = [] } = useQuery({
    queryKey: ["images", system?.id],
    queryFn: () => getImages(system?.id),
    enabled: !!system?.id,
  });

  if (isPending) return <Loading />;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!system) {
    console.error("System Context is null");
    return <div>Error: System is missing.</div>;
  }

  // Helper function to find image by ID from media library
  const findImageById = (imageId: string): ImageType | undefined => {
    return allImages.find((img) => img.id === imageId);
  };

  // Get background image URL for Hero component
  const getBackgroundImageUrl = (): string | undefined => {
    if (system?.backgroundImageId && allImages.length) {
      const systemBackgroundImage = findImageById(system.backgroundImageId);
      if (systemBackgroundImage) {
        return `${getImageUrl(systemBackgroundImage.filename, "background")}?t=${Date.now()}`;
      }
    }
    return undefined;
  };

  return (
    <div className="content-wrap">
      <Hero
        name={system.name}
        backgroundImage={getBackgroundImageUrl()}
      />
      <div className="content">
        <div className="content__main wysiwyg">
          {system.introduction && (
            <div
              className="text-lg"
              dangerouslySetInnerHTML={{ __html: system.introduction }}
            ></div>
          )}

          {/* Abilities Section */}
          {system.abilities && system.abilities.length > 0 && (
            <section className="system-section" id="abilities">
              <h2>Abilities</h2>
              <div className="abilities-grid">
                {system.abilities
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((ability, index) => (
                    <div key={ability.id || `ability-${index}`} className="ability-card">
                      <div className="ability-header">
                        <h3 className="ability-name">{ability.name}</h3>
                        <span className="ability-abbr">({getAbilityAbbreviation(ability)})</span>
                      </div>
                      {ability.description && (
                        <p className="ability-description">{ability.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Skills Section */}
          {system.skills && system.skills.length > 0 && (
            <section className="system-section" id="skills">
              <h2>Skills</h2>
              <div className="skills-grid">
                {system.skills
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((skill, index) => (
                    <div key={skill.id || `skill-${index}`} className="skill-card">
                      <h3 className="skill-name">{skill.name}</h3>
                      {skill.description && (
                        <p className="skill-description">{skill.description}</p>
                      )}
                      {skill.relatedAbility && (
                        <p className="skill-ability">
                          <strong>Related Ability:</strong> {skill.relatedAbility.name} ({getAbilityAbbreviation(skill.relatedAbility)})
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Races Section */}
          {system.character.races && system.character.races.length > 0 && (
            <section className="system-section" id="races">
              <h2>Races</h2>
              <div className="races-grid">
                {system.character.races.map((race, index) => (
                  <div key={race.id || `race-${index}`} className="race-card">
                    <h3 className="race-name">{race.name}</h3>
                    {race.introduction && (
                      <div
                        className="race-introduction"
                        dangerouslySetInnerHTML={{ __html: race.introduction }}
                      ></div>
                    )}
                    {race.alignment?.value && (
                      <p className="race-alignment">
                        <strong>Alignment:</strong> {race.alignment.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Roles Section */}
          {system.character.roles && system.character.roles.length > 0 && (
            <section className="system-section" id="roles">
              <h2>Roles</h2>
              <div className="roles-grid">
                {system.character.roles.map((role, index) => (
                  <div key={role.id || `role-${index}`} className="role-card">
                    <h3 className="role-name">{role.name}</h3>
                    {role.introduction && (
                      <div
                        className="role-introduction"
                        dangerouslySetInnerHTML={{ __html: role.introduction }}
                      ></div>
                    )}
                    {role.armorTaxonomies && role.armorTaxonomies.length > 0 && (
                      <div className="role-armor">
                        <h4>Armor</h4>
                        <div className="armor-list">
                          {role.armorTaxonomies.map((armor: ArmorTaxonomyType, armorIndex: number) => (
                            <span key={armor.name || `armor-${armorIndex}`} className="armor-item">
                              {armor.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {role.weaponTaxonomies && role.weaponTaxonomies.length > 0 && (
                      <div className="role-weapons">
                        <h4>Weapons</h4>
                        <div className="weapons-list">
                          {role.weaponTaxonomies.map((weapon: WeaponTaxonomyType, weaponIndex: number) => (
                            <span key={weapon.id || `weapon-${weaponIndex}`} className="weapon-item">
                              {weapon.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="content__sidebar">
          <nav className="nav-page">
            <h3 className="nav-page__title">On This Page</h3>
            <ul className="nav-page__list">
              {system.abilities && system.abilities.length > 0 && (
                <li className="nav-page__item">
                  <a href="#abilities">Abilities</a>
                </li>
              )}
              {system.skills && system.skills.length > 0 && (
                <li className="nav-page__item">
                  <a href="#skills">Skills</a>
                </li>
              )}
              {system.character.races && system.character.races.length > 0 && (
                <li className="nav-page__item">
                  <a href="#races">Races</a>
                </li>
              )}
              {system.character.roles && system.character.roles.length > 0 && (
                <li className="nav-page__item">
                  <a href="#roles">Roles</a>
                </li>
              )}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default System;

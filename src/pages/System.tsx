import { useParams } from "react-router-dom";
import { SystemProvider } from "../provider/SystemProvider";
import { useSystem } from "../hooks/useProvider";
import Hero from "../components/Hero/Hero";
import Loading from "../components/Loading/Loading";
import { ArmorTaxonomyType, WeaponTaxonomyType } from "@mod20/types";

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

  if (isPending) return <Loading />;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!system) {
    console.error("System Context is null");
    return <div>Error: System is missing.</div>;
  }

  return (
    <div className="content-wrap">
      <Hero name={system.name} version={system.version} />
      <div className="content">
        <div className="content__main wysiwyg">
          {system.introduction && (
            <div
              className="text-lg"
              dangerouslySetInnerHTML={{ __html: system.introduction }}
            ></div>
          )}
          <div>
            {system.character.races?.map((race) => (
              <div>
                <h1>{race.name}</h1>
                <p>{race.alignment?.value}</p>
              </div>
            ))}

            {system.character.roles?.map((role) => (
              <div>
                <h1>{role.name}</h1>
                {role.introduction && (
                  <div
                    dangerouslySetInnerHTML={{ __html: role.introduction }}
                  ></div>
                )}
                {role.armorTaxonomies && role.armorTaxonomies.length > 0 && (
                  <div>
                    <h2>Armor</h2>
                    {role.armorTaxonomies.map((armor: ArmorTaxonomyType) => (
                      <div key={armor.name}>
                        <span>{armor.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {role.weaponTaxonomies && role.weaponTaxonomies.length > 0 && (
                  <div>
                    <h2>Weapons</h2>
                    {role.weaponTaxonomies?.map(
                      (weapon: WeaponTaxonomyType) => (
                        <div key={weapon.id}>
                          <span>{weapon.name}</span>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <aside className="content__sidebar">
          <div>
            <h1>Sidebar</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <nav className="nav-page">
            <h3 className="nav-page__title">On This Page</h3>
            <ul className="nav-page__list">
              <li className="nav-page__item">
                <a href="#">Link 1</a>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default System;

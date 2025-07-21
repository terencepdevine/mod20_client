import { RoleProvider } from "../../provider/RoleProvider";
import Hero from "../../components/Hero/Hero";
import { useRole } from "../../hooks/useProvider";
import { Link, useParams } from "react-router-dom";
import { RoleType } from "@mod20/types";
import { joinWithComma } from "../../utils/joinWithComma";
import "./Role.css";

const Role: React.FC = () => {
  const { systemSlug, sectionSlug } = useParams();

  return (
    <RoleProvider
      systemSlug={systemSlug as string}
      sectionSlug={sectionSlug as string}
    >
      <RoleContent />
    </RoleProvider>
  );
};

const RoleContent: React.FC = () => {
  const { data, isPending, isError, error } = useRole();
  const role = data.role as RoleType;

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!data) {
    console.error("RoleContext is null");
    return <div>Error: Role data is missing.</div>;
  }

  return (
    <div className="content-wrap">
      <Hero name={role.name} />
      <div className="content">
        <div className="content__main wysiwyg">
          {role.photo && (
            <img
              src={`http://localhost:3000/public/img/roles/${role.photo}`}
              alt=""
              className="full-width"
            />
          )}

          {role.introduction && (
            <div
              className="text-lg"
              dangerouslySetInnerHTML={{ __html: role.introduction as string }}
            ></div>
          )}

          <div>
            <h2>Class Features</h2>
            <p>As a {role.name}, you gain the following class features.</p>
          </div>

          <div id="hit-points">
            <h3>Hit Points</h3>
            <p>
              <strong>Hit Points:</strong> 1d{role.hp_dice} per {role.name}{" "}
              level
            </p>
            <p>
              <strong>Hit Points at 1st Level:</strong> {role.hp_dice} + your
              Constitution modifier.
            </p>
            <p>
              <strong>Hit Points at Higher Levels:</strong> 1d{role.hp_dice} +
              your Constitution modifier per {role.name} level after 1st.
            </p>
          </div>

          <div id="proficiencies">
            <h3>Proficiencies</h3>
            {role.armorTaxonomies && (
              <p>
                <strong>Armor: </strong>
                {joinWithComma(role.armorTaxonomies)}
              </p>
            )}
            {role.weaponTaxonomies && (
              <p>
                <strong>Weapons: </strong>
                {joinWithComma(role.weaponTaxonomies)}
              </p>
            )}
            <p>
              <strong>Tools: </strong>
              {role.tools ? joinWithComma(role.tools) : "None"}
            </p>
            {role.savingThrows && (
              <p>
                <strong>Saving Throws: </strong>
                {joinWithComma(role.savingThrows)}
              </p>
            )}
            {role.skills && (
              <p>
                <strong>Skills: </strong>
                {joinWithComma(role.skills)}
              </p>
            )}
          </div>
        </div>
        <div className="content__sidebar">
          <div>
            <h3>Sidebar Content</h3>
          </div>
          <div className="nav-page-wrap">
            <nav className="nav-page">
              <h4>On This Page</h4>
              <ul className="nav-page__list">
                <li className="nav-page__item">
                  <Link to="#hit-points" className="nav-page__link">
                    Hit Points
                  </Link>
                </li>
                <li className="nav-page__item">
                  <Link to="#proficiencies" className="nav-page__link">
                    Proficiencies
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;

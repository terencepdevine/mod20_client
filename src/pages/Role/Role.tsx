import { RoleProvider } from "../../provider/RoleProvider";
import { SystemProvider } from "../../provider/SystemProvider";
import Hero from "../../components/Hero/Hero";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import { useRole, useSystem } from "../../hooks/useProvider";
import { Link, useParams } from "react-router-dom";
import { RoleType, ImageType } from "@mod20/types";
import { joinWithComma } from "../../utils/joinWithComma";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "../../services/apiSystem";
import { getImageUrl } from "../../utils/imageUtils";
import "./Role.css";

const Role: React.FC = () => {
  const { systemSlug, sectionSlug } = useParams();

  return (
    <SystemProvider systemSlug={systemSlug as string}>
      <RoleProvider
        systemSlug={systemSlug as string}
        sectionSlug={sectionSlug as string}
      >
        <RoleContent />
      </RoleProvider>
    </SystemProvider>
  );
};

const RoleContent: React.FC = () => {
  const { data, isPending, isError, error } = useRole();
  const { data: systemData } = useSystem();
  const role = data as RoleType;

  // Query for media library images to resolve Image IDs
  const { data: allImages = [] } = useQuery({
    queryKey: ["images", systemData?.id],
    queryFn: () => getImages(systemData?.id),
    enabled: !!systemData?.id,
  });

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!data) {
    console.error("RoleContext is null");
    return <div>Error: Role data is missing.</div>;
  }

  // Helper function to find image by ID from media library
  const findImageById = (imageId: string): ImageType | undefined => {
    return allImages.find((img) => img.id === imageId);
  };

  // Helper function to get role gallery images
  const getRoleImages = (): ImageType[] => {
    if (!role?.images || !allImages.length) return [];
    const orderedImages = role.images.sort((a, b) => a.orderby - b.orderby);
    return orderedImages
      .map((item) => findImageById(item.imageId))
      .filter(Boolean) as ImageType[];
  };

  // Helper function to get background image
  const getBackgroundImage = (): ImageType | null => {
    if (!role?.backgroundImageId || !allImages.length) return null;
    return findImageById(role.backgroundImageId) || null;
  };


  // Get background image URL for Hero component (role first, then system fallback)
  const getBackgroundImageUrl = (): string | undefined => {
    // First try role's background image
    const roleBackgroundImage = getBackgroundImage();
    if (roleBackgroundImage) {
      return `${getImageUrl(roleBackgroundImage.filename, 'background')}?t=${Date.now()}`;
    }
    
    // Fallback to system's background image
    if (systemData?.backgroundImageId && allImages.length) {
      const systemBackgroundImage = findImageById(systemData.backgroundImageId);
      if (systemBackgroundImage) {
        return `${getImageUrl(systemBackgroundImage.filename, 'background')}?t=${Date.now()}`;
      }
    }
    
    return undefined;
  };

  return (
    <div className="content-wrap">
      <Hero name={role.name} backgroundImage={getBackgroundImageUrl()} />
      <div className="content">
        <div className="content__main wysiwyg">

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
              <strong>Hit Points at 1st Level:</strong> {role.hp_dice} + your{" "}
              {role.primaryAbility?.name || "primary ability"} modifier.
            </p>
            <p>
              <strong>Hit Points at Higher Levels:</strong> 1d{role.hp_dice} +
              your {role.primaryAbility?.name || "primary ability"} modifier per{" "}
              {role.name} level after 1st.
            </p>
          </div>

          <div id="proficiencies">
            <h3>Proficiencies</h3>
            {role.armorTaxonomies && (
              <p>
                <strong>Armor: </strong>
                {role.armorTaxonomies
                  ? joinWithComma(role.armorTaxonomies.map((item) => item.name))
                  : "None"}
              </p>
            )}
            {role.weaponTaxonomies && (
              <p>
                <strong>Weapons: </strong>
                {role.weaponTaxonomies
                  ? joinWithComma(
                      role.weaponTaxonomies.map((item) => item.name),
                    )
                  : "None"}
              </p>
            )}
            <p>
              <strong>Tools: </strong>
              {role.tools ? joinWithComma(role.tools) : "None"}
            </p>
            {role.savingThrows && (
              <p>
                <strong>Saving Throws: </strong>
                {role.savingThrows
                  ? joinWithComma(role.savingThrows)
                  : "None"}
              </p>
            )}
            {role.skills && (
              <p>
                <strong>Skills: </strong>
                {role.skills
                  ? joinWithComma(role.skills.map((item) => 
                      item.relatedAbility 
                        ? `${item.name} (${item.relatedAbility.name})`
                        : item.name
                    ))
                  : "None"}
              </p>
            )}
          </div>
        </div>
        <div className="content__sidebar">
          {/* Featured Images Gallery */}
          {(() => {
            const roleImages = getRoleImages();
            return (
              roleImages.length > 0 && (
                <ImageGallery
                  images={roleImages.map(
                    (img) => getImageUrl(img.filename, 'gallery')
                  )}
                  basePath=""
                  alt={`${role.name} images`}
                />
              )
            );
          })()}
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

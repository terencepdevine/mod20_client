import { useParams, Link } from "react-router-dom";
import { SystemProvider } from "../provider/SystemProvider";
import { useSystem } from "../hooks/useProvider";
import Hero from "../components/Hero/Hero";
import Loading from "../components/Loading/Loading";
import { RoleType, ImageType } from "@mod20/types";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "../services/apiSystem";
import { getImageUrl } from "../utils/imageUtils";

const Roles: React.FC = () => {
  const { systemSlug } = useParams();

  if (!systemSlug) {
    return <h1>Error: Missing system slug</h1>;
  }

  return (
    <SystemProvider systemSlug={systemSlug}>
      <RolesContent />
    </SystemProvider>
  );
};

const RolesContent: React.FC = () => {
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

  // Get background image URL for Hero component (system background)
  const getBackgroundImageUrl = (): string | undefined => {
    if (system?.backgroundImageId && allImages.length) {
      const systemBackgroundImage = findImageById(system.backgroundImageId);
      if (systemBackgroundImage) {
        return `${getImageUrl(systemBackgroundImage.filename, 'background')}?t=${Date.now()}`;
      }
    }
    return undefined;
  };

  // Get role background image URL with system fallback
  const getRoleBackgroundImageUrl = (role: RoleType): string | undefined => {
    // First try role's background image
    if (role.backgroundImageId && allImages.length) {
      const roleBackgroundImage = findImageById(role.backgroundImageId);
      if (roleBackgroundImage) {
        return `${getImageUrl(roleBackgroundImage.filename, 'background')}?t=${Date.now()}`;
      }
    }
    
    // Fallback to system's background image
    return getBackgroundImageUrl();
  };

  return (
    <div className="content-wrap">
      <Hero name="Roles" backgroundImage={getBackgroundImageUrl()} />
      <div className="content">
        <div className="content__main">
          <div className="roles-grid">
            {system.character?.roles?.map((role: RoleType) => (
              <div key={role.id} className="role-card">
                <Link to={`/systems/${system.slug}/roles/${role.slug}`}>
                  <div 
                    className="role-card__hero"
                    style={{
                      backgroundImage: getRoleBackgroundImageUrl(role) 
                        ? `url(${getRoleBackgroundImageUrl(role)})` 
                        : undefined
                    }}
                  >
                    <h3 className="role-card__title">{role.name}</h3>
                  </div>
                  {role.introduction && (
                    <div className="role-card__content">
                      <div 
                        className="role-card__intro"
                        dangerouslySetInnerHTML={{ 
                          __html: role.introduction.substring(0, 150) + (role.introduction.length > 150 ? '...' : '')
                        }}
                      />
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="content__sidebar">
          <div className="nav-page-wrap">
            <nav className="nav-page">
              <h4>Available Roles</h4>
              <ul className="nav-page__list">
                {system.character?.roles?.map((role: RoleType) => (
                  <li key={role.id} className="nav-page__item">
                    <Link to={`/systems/${system.slug}/roles/${role.slug}`} className="nav-page__link">
                      {role.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;

import { TraitType } from "@mod20/types";
import { useParams } from "react-router-dom";
import { useTrait, useSystem } from "../hooks/useProvider";
import { TraitProvider } from "../provider/TraitProvider";
import { SystemProvider } from "../provider/SystemProvider";
import Hero from "../components/Hero/Hero";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "../services/apiSystem";
import { getImageUrl } from "../utils/imageUtils";

const Trait: React.FC = () => {
  const { systemSlug, sectionSlug } = useParams();

  return (
    <SystemProvider systemSlug={systemSlug as string}>
      <TraitProvider
        systemSlug={systemSlug as string}
        sectionSlug={sectionSlug as string}
      >
        <TraitContent />
      </TraitProvider>
    </SystemProvider>
  );
};

const TraitContent: React.FC = () => {
  const { data, isPending, isError, error } = useTrait();
  const { data: systemData } = useSystem();
  const trait = data as TraitType;

  // Query for media library images to resolve Image IDs for system background
  const { data: allImages = [] } = useQuery({
    queryKey: ["images", trait?.system],
    queryFn: () => getImages(trait?.system),
    enabled: !!trait?.system,
  });

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!data) {
    console.error("TraitContext is null");
    return <div>Error: Trait data is missing.</div>;
  }

  // Get background image URL for Hero component (system fallback only since traits don't have background images)
  const getBackgroundImageUrl = (): string | undefined => {
    // Use system's background image as fallback
    if (systemData?.backgroundImageId && allImages.length) {
      const systemBackgroundImage = allImages.find((img) => img.id === systemData.backgroundImageId);
      if (systemBackgroundImage) {
        return `${getImageUrl(systemBackgroundImage.filename, 'background')}?t=${Date.now()}`;
      }
    }
    
    return undefined;
  };

  return (
    <div className="content-wrap">
      <Hero name={trait.name} backgroundImage={getBackgroundImageUrl()} />
      <div className="content">
        <div className="content__main wysiwyg">
          {trait.description && (
            <div 
              className="trait-description" 
              dangerouslySetInnerHTML={{ __html: trait.description }} 
            />
          )}
          
          {!trait.description && (
            <p className="text-muted">No description available for this trait.</p>
          )}
        </div>
        <div className="content__sidebar">
          <div className="nav-page-wrap">
            <nav className="nav-page">
              <h4>Trait Details</h4>
              <div className="trait-meta">
                {trait.system && (
                  <p><strong>System:</strong> {systemData?.name || trait.system}</p>
                )}
                {trait.createdAt && (
                  <p><strong>Created:</strong> {new Date(trait.createdAt).toLocaleDateString()}</p>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trait;
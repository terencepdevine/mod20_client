import { useQuery } from "@tanstack/react-query";
import { ImageType, RaceType, RoleType, SystemType } from "@mod20/types";
import { getImages } from "../services/apiSystem";
import { getImageUrl } from "../utils/imageUtils";

interface UseImagesOptions {
  systemId?: string;
  enabled?: boolean;
}

interface ImageReference {
  imageId: string;
  orderby: number;
}

// Type for entities that have image fields (Race, Role, System)
type EntityWithImages = {
  system?: string;
  images?: ImageReference[];
  backgroundImageId?: string;
};

export const useImages = ({ systemId, enabled = true }: UseImagesOptions = {}) => {
  return useQuery({
    queryKey: ["images"],
    queryFn: () => getImages(),
    enabled,
  });
};

// Comprehensive hook for entities with images (Race, Role, System)
export const useEntityImages = (entity: EntityWithImages | null | undefined) => {
  const { data: allImages = [] } = useImages({
    systemId: entity?.system,
    enabled: !!entity,
  });
  
  const helpers = useImageHelpers(allImages);
  
  return {
    allImages,
    ...helpers,
    // Computed values for the entity
    galleryImages: entity?.images ? helpers.getOrderedImages(entity.images) : [],
    backgroundImageUrl: helpers.getBackgroundImageUrl(entity?.backgroundImageId),
    galleryImageUrls: entity?.images ? helpers.getGalleryImageUrls(entity.images) : [],
  };
};

export const useImageHelpers = (allImages: ImageType[] = []) => {
  const findImageById = (imageId: string): ImageType | undefined => {
    return allImages.find((img) => img.id === imageId);
  };

  const getImagesByIds = (imageIds: string[]): ImageType[] => {
    return imageIds
      .map(id => findImageById(id))
      .filter(Boolean) as ImageType[];
  };

  const getOrderedImages = (images: ImageReference[]): ImageType[] => {
    if (!images || !allImages.length) return [];
    
    const orderedImages = images.sort((a, b) => a.orderby - b.orderby);
    return orderedImages
      .map((item) => findImageById(item.imageId))
      .filter(Boolean) as ImageType[];
  };

  const getBackgroundImageUrl = (backgroundImageId?: string): string | undefined => {
    if (!backgroundImageId || !allImages.length) return undefined;
    
    const image = findImageById(backgroundImageId);
    return image 
      ? `${getImageUrl(image.filename, "background")}?t=${Date.now()}`
      : undefined;
  };

  const getGalleryImageUrls = (images: ImageReference[]): string[] => {
    const imageObjects = getOrderedImages(images);
    return imageObjects.map(img => getImageUrl(img.filename, "gallery"));
  };

  return {
    findImageById,
    getImagesByIds,
    getOrderedImages,
    getBackgroundImageUrl,
    getGalleryImageUrls,
  };
};
import { useState } from "react";
import ImageModal from "../ImageModal/ImageModal";
import "./ImageGallery.scss";

interface ImageGalleryProps {
  images: string[];
  basePath?: string;
  alt?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  basePath = "http://localhost:3000/public/img/roles/",
  alt = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const displayImages = images.slice(0, 4);
  const [featuredImage, ...thumbnailImages] = displayImages;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="image-gallery">
      {featuredImage && (
        <div className="image-gallery__item image-gallery__item--featured">
          <img
            src={`${basePath}${featuredImage}`}
            alt={`${alt} 1`}
            className="image-gallery__image image-gallery__image--clickable"
            onClick={() => handleImageClick(0)}
          />
        </div>
      )}
      {thumbnailImages.length > 0 && (
        <div className="image-gallery__thumbnails">
          {thumbnailImages.map((image, index) => (
            <div key={index + 1} className="image-gallery__item">
              <img
                src={`${basePath}${image}`}
                alt={`${alt} ${index + 2}`}
                className="image-gallery__image image-gallery__image--clickable"
                onClick={() => handleImageClick(index + 1)}
              />
            </div>
          ))}
        </div>
      )}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        currentImageIndex={selectedImageIndex}
        basePath={basePath}
        alt={alt}
      />
    </div>
  );
};

export default ImageGallery;

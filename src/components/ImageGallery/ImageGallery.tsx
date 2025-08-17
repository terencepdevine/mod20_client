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
  if (!images || images.length === 0) {
    return null;
  }

  const displayImages = images.slice(0, 4);
  const [featuredImage, ...thumbnailImages] = displayImages;

  return (
    <div className="image-gallery">
      {featuredImage && (
        <div className="image-gallery__item image-gallery__item--featured">
          <img
            src={`${basePath}${featuredImage}`}
            alt={`${alt} 1`}
            className="image-gallery__image"
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
                className="image-gallery__image"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./ImageGallery.css";

interface ImageGalleryProps {
  images: string[];
  basePath?: string;
  alt?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  basePath = "http://localhost:3000/public/img/roles/", 
  alt = "" 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
    } else {
      setSelectedImageIndex(selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <div className={`image-gallery ${images.length === 1 ? 'single-image' : ''}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="image-gallery__item"
            onClick={() => openModal(index)}
          >
            <img
              src={`${basePath}${image}`}
              alt={`${alt} ${index + 1}`}
              className="image-gallery__image"
            />
            {images.length > 1 && (
              <div className="image-gallery__overlay">
                <span className="image-gallery__index">{index + 1}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            className="image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              className="image-modal__content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="image-modal__close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
              
              {images.length > 1 && (
                <>
                  <button
                    className="image-modal__nav image-modal__nav--prev"
                    onClick={() => navigateImage('prev')}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    className="image-modal__nav image-modal__nav--next"
                    onClick={() => navigateImage('next')}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}

              <img
                src={`${basePath}${images[selectedImageIndex]}`}
                alt={`${alt} ${selectedImageIndex + 1}`}
                className="image-modal__image"
              />
              
              {images.length > 1 && (
                <div className="image-modal__counter">
                  {selectedImageIndex + 1} of {images.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;
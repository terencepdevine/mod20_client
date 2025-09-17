import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import "./ImageModal.scss";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentImageIndex: number;
  basePath?: string;
  alt?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  images,
  currentImageIndex,
  basePath = "",
  alt = "",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(currentImageIndex);

  // Reset selectedIndex when modal opens or currentImageIndex changes
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(currentImageIndex);
    }
  }, [isOpen, currentImageIndex]);

  const currentImage = images[selectedIndex];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="image-modal">
        {currentImage && (
          <div className="image-modal__main">
            <img
              src={`${basePath}${currentImage}`}
              alt={`${alt} ${selectedIndex + 1}`}
              className="image-modal__image"
            />
          </div>
        )}
        {images.length > 1 && (
          <div className="image-modal__thumbnails">
            {images.map((image, index) => (
              <button
                key={index}
                className={`image-modal__thumbnail ${
                  index === selectedIndex ? "image-modal__thumbnail--active" : ""
                }`}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <img
                  src={`${basePath}${image}`}
                  alt={`${alt} thumbnail ${index + 1}`}
                  className="image-modal__thumbnail-image"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageModal;
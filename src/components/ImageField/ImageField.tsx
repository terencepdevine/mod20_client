import React from 'react';
import { ImageFieldProps } from '../../types/ImageField';
import Button from '../Button';
import './ImageField.scss';

const ImageField: React.FC<ImageFieldProps> = ({
  label,
  description,
  isMultiple,
  maxCount,
  currentImages,
  onAddImage,
  onRemoveImage,
  isLoading = false
}) => {
  const canAddMore = !maxCount || currentImages.length < maxCount;

  const handleRemoveImage = (imageId: string) => {
    const confirmMessage = `Are you sure you want to remove this image from ${label.toLowerCase()}?`;
    if (window.confirm(confirmMessage)) {
      onRemoveImage(imageId);
    }
  };

  return (
    <div className="image-field">
      <div className="image-field-header">
        <div>
          <h3>{label} ({currentImages.length}/{maxCount || '∞'})</h3>
          <p className="image-field-description">{description}</p>
        </div>
        <Button
          type="button"
          onClick={onAddImage}
          disabled={!canAddMore || isLoading}
          className="add-images-btn"
        >
          Add {label}
        </Button>
      </div>
      
      {currentImages.length === 0 ? (
        <div className="no-images-message">
          <p>No images assigned to {label.toLowerCase()} yet.</p>
          <p>Click "Add {label}" to choose from the media library.</p>
        </div>
      ) : (
        <div className="image-field-grid">
          {currentImages.map((image, index) => (
            <div key={image.id} className="image-field-item">
              <img
                src={`http://localhost:3000/public/img/media/${image.filename}`}
                alt={image.alt || `${label} ${index + 1}`}
                className="image-field-image"
              />
              <button
                type="button"
                className="image-field-delete"
                onClick={() => handleRemoveImage(image.id)}
                title={`Remove image from ${label.toLowerCase()}`}
              >
                ×
              </button>
              {isMultiple && (
                <span className="image-field-index">{index + 1}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageField;
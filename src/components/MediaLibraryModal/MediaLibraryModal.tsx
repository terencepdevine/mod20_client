import React, { useRef, useState } from "react";
import { MediaLibraryModalProps } from "../../types/ImageField";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import "./MediaLibraryModal.scss";

const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  title,
  label,
  maxCount,
  mediaLibraryImages,
  currentImages,
  onClose,
  onAddImage,
  onRemoveImage,
  onDeleteImage,
  onUpload,
  isLoadingImages = false,
  imagesError = null,
  isUploading = false,
}) => {
  if (!isOpen) return null;

  // Upload functionality state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const validFiles: File[] = [];

    // Validate each file
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not an image file - skipping`);
        continue;
      }

      // Validate file size (e.g., 10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" is larger than 10MB - skipping`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      toast.error("No valid image files selected");
      return;
    }

    // Create previews for valid files
    const previewPromises = validFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then((previewResults) => {
      setSelectedFiles(validFiles);
      setPreviews(previewResults);
    });
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files first");
      return;
    }

    onUpload(selectedFiles);

    // Clear selection after upload
    setSelectedFiles([]);
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImageInField = (imageId: string): boolean => {
    return currentImages.some((img) => img.id === imageId);
  };

  const canAddMore = !maxCount || currentImages.length < maxCount;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Upload Section */}
          <div className="modal-upload-section">
            <h3>Upload New Images</h3>
            <div className="upload-field-content">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="upload-input"
                disabled={isUploading}
              />

              {previews.length > 0 && (
                <div className="image-previews">
                  <h5>Selected Images ({selectedFiles.length}):</h5>
                  <div className="preview-grid">
                    {previews.map((preview, index) => (
                      <div key={index} className="preview-item">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="preview-image"
                        />
                        <span className="preview-filename">
                          {selectedFiles[index]?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                type="button"
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="upload-btn"
              >
                {isUploading
                  ? `Uploading ${selectedFiles.length} images...`
                  : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? "s" : ""} to Media Library`}
              </Button>
            </div>
          </div>

          {/* Media Library Grid */}
          <div className="modal-media-library-section">
            <h3>Choose from Media Library</h3>
            {isLoadingImages ? (
              <p>Loading images...</p>
            ) : imagesError ? (
              <div className="error-message">
                <p>Error loading images: {imagesError.message}</p>
                <p>
                  The media library API endpoints need to be implemented on the
                  backend.
                </p>
              </div>
            ) : (
              <div className="modal-media-library-grid">
                {mediaLibraryImages.map((image) => {
                  const imageId = image.id;
                  const isInField = isImageInField(imageId);
                  const canAdd = !isInField && canAddMore;

                  return (
                    <div
                      key={imageId}
                      className={`modal-media-library-item ${isInField ? "in-field" : ""}`}
                    >
                      <img
                        src={`http://localhost:3000/public/img/media/${image.filename}`}
                        alt={image.alt || image.originalName}
                        className="modal-media-library-image"
                      />
                      <div className="modal-media-library-overlay">
                        <p className="image-name">{image.originalName}</p>
                        <div className="modal-media-library-buttons">
                          {isInField ? (
                            <Button
                              type="button"
                              onClick={() => onRemoveImage(imageId)}
                              className="remove-btn"
                            >
                              Remove
                            </Button>
                          ) : canAdd ? (
                            <Button
                              type="button"
                              onClick={() => onAddImage(imageId)}
                              className="add-btn"
                            >
                              Select
                            </Button>
                          ) : (
                            <Button type="button" disabled className="add-btn">
                              {label} Full
                            </Button>
                          )}
                          <Button
                            type="button"
                            onClick={() =>
                              onDeleteImage(imageId, image.originalName)
                            }
                            className="delete-btn"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {mediaLibraryImages.length === 0 && !isLoadingImages && (
                  <div className="no-images-message">
                    <p>No images in media library.</p>
                    <p>Upload some images first.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaLibraryModal;

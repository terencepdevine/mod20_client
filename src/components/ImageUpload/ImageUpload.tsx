import React, { useRef, useState } from 'react';
import { ImageUploadFieldProps } from '../../types/ImageField';
import Button from '../Button';
import { toast } from 'react-toastify';
import './ImageUpload.css';

const ImageUpload: React.FC<ImageUploadFieldProps> = ({
  onUpload,
  isUploading = false
}) => {
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

  return (
    <div className="image-upload">
      <div className="image-upload-header">
        <h3>Upload New Image to Media Library</h3>
      </div>

      <div className="image-upload-field">
        <div className="upload-field-header">
          <label className="upload-label">Select Images (multiple files supported)</label>
        </div>

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
              : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''} to Media Library`
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
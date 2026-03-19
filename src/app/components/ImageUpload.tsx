import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
  multiple?: boolean;
  onMultipleUpload?: (urls: string[]) => void;
}

export default function ImageUpload({
  onImageUpload,
  currentImage,
  label = 'Upload Image',
  multiple = false,
  onMultipleUpload,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      if (multiple && files.length > 1) {
        const urls = await api.uploadImages(Array.from(files));
        const imageUrls = urls.map((u: any) => u.url);
        setUploadedUrls(imageUrls);
        if (onMultipleUpload) {
          onMultipleUpload(imageUrls);
        }
        toast.success(`${files.length} images uploaded successfully`);
      } else if (multiple && files.length === 1) {
        // Handle single file with multiple mode
        const file = files[0];
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select an image file');
        }
        const result = await api.uploadImage(file);
        const imageUrls = [result.url];
        setUploadedUrls(imageUrls);
        if (onMultipleUpload) {
          onMultipleUpload(imageUrls);
        }
        toast.success('Image uploaded successfully');
      } else {
        // Single file mode
        const file = files[0];
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select an image file');
        }

        const result = await api.uploadImage(file);
        setPreview(result.url);
        if (onImageUpload) {
          onImageUpload(result.url);
        }
        toast.success('Image uploaded successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(undefined);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="file-input" className="text-[#374151]">{label}</Label>

      {preview && !multiple ? (
        <div className="relative">
          <img
            src={preview}
            alt={`Preview of ${label}`}
            className="w-full h-48 object-cover rounded-lg border border-[#D1D5DB]"
          />
          <button
            onClick={handleRemoveImage}
            aria-label={`Remove ${label}`}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          tabIndex={0}
          aria-label={`Click to upload ${label} or drag and drop`}
          className="border-2 border-dashed border-[#D1D5DB] rounded-lg p-8 text-center cursor-pointer hover:border-[#0052FF] hover:bg-[#0052FF]/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2"
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2" role="status" aria-live="polite">
              <Loader2 className="w-5 h-5 animate-spin text-[#0052FF]" aria-hidden="true" />
              <span className="text-[#9CA3AF]">Uploading...</span>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" aria-hidden="true" />
              <p className="text-[#374151] font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-[#9CA3AF]">PNG, JPG, GIF up to 10MB</p>
            </>
          )}
        </div>
      )}

      {uploadedUrls.length > 0 && multiple && (
        <div className="grid grid-cols-3 gap-4" role="region" aria-label="Uploaded images">
          {uploadedUrls.map((url, idx) => (
            <div key={idx} className="relative group">
              <img
                src={url}
                alt={`Uploaded image ${idx + 1} of ${uploadedUrls.length}`}
                className="w-full h-24 object-cover rounded-lg border border-[#D1D5DB]"
              />
              <button
                onClick={() => {
                  const updated = uploadedUrls.filter((_, i) => i !== idx);
                  setUploadedUrls(updated);
                  if (onMultipleUpload) {
                    onMultipleUpload(updated);
                  }
                }}
                aria-label={`Remove uploaded image ${idx + 1}`}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        id="file-input"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        aria-label={label}
      />
    </div>
  );
}

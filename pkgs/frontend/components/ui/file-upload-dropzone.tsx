'use client';

import {
  AlertCircle,
  CheckCircle2,
  File,
  FileSpreadsheet,
  FileText,
  Loader2,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface FileUploadDropzoneProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  validateMagicBytes?: boolean;
  className?: string;
}

interface FilePreview {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

const validateFileSignature = async (file: File): Promise<boolean> => {
  const arr = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const header = arr.reduce((acc, b) => acc + b.toString(16).padStart(2, '0'), '').toUpperCase();
  const extension = file.name.split('.').pop()?.toLowerCase();

  // PDF: Starts with %PDF (25 50 44 46)
  if (extension === 'pdf') {
    return header.startsWith('25504446');
  }

  // DICOM: Validation is complex (header at offset 128), checks for DICM at 128-131
  if (extension === 'dcm' || extension === 'dicom') {
    if (file.size < 132) return false;
    const dicomHeader = new Uint8Array(await file.slice(128, 132).arrayBuffer());
    const dicomSig = Array.from(dicomHeader).map(b => String.fromCharCode(b)).join('');
    return dicomSig === 'DICM';
  }

  // JSON: Basic check if it starts with { or [
  if (extension === 'json') {
    const text = await file.text();
    const trimmed = text.trim();
    return trimmed.startsWith('{') || trimmed.startsWith('[');
  }

  // CSV: Basic check - just ensure it's text and has matching extension
  if (extension === 'csv') {
    return true; // Difficult to strictly validate signatures for CSV without parsing
  }

  return true; // Allow other types if not explicitly checked
};

const getFileIcon = (type: string, name: string) => {
  const extension = name.split('.').pop()?.toLowerCase();

  if (extension === 'csv' || type.includes('csv')) {
    return <FileSpreadsheet className="h-8 w-8 text-emerald-600" />;
  }
  if (extension === 'json' || type.includes('json')) {
    return <FileText className="h-8 w-8 text-blue-600" />;
  }
  if (extension === 'pdf' || type.includes('pdf')) {
    return <FileText className="h-8 w-8 text-red-500" />;
  }
  if (extension === 'dcm' || extension === 'dicom') {
    return <File className="h-8 w-8 text-purple-600" />;
  }
  return <File className="h-8 w-8 text-slate-500" />;
};

export function FileUploadDropzone({
  onFileSelect,
  onFileRemove,
  accept = '.pdf,.csv,.json,.dcm,.dicom',
  maxSize = 100,
  disabled = false,
  isUploading = false,
  uploadProgress = 0,
  validateMagicBytes = false,
  className = '',
}: FileUploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FilePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize * 1024 * 1024) {
        return `File size exceeds ${maxSize}MB limit`;
      }

      const acceptedTypes = accept
        .split(',')
        .map((t) => t.trim().toLowerCase());
      const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const mimeType = file.type.toLowerCase();

      const isValidType = acceptedTypes.some(
        (type) =>
          extension === type ||
          mimeType.includes(type.replace('.', '')) ||
          (type === '.csv' && mimeType === 'text/csv') ||
          (type === '.json' && mimeType === 'application/json') ||
          (type === '.pdf' && mimeType === 'application/pdf'),
      );

      if (!isValidType) {
        return `File type not supported. Please upload: ${accept}`;
      }

      return null;
    },
    [accept, maxSize],
  );

  const handleFile = useCallback(
    async (file: File) => {
      const basicError = validateFile(file);
      if (basicError) {
        setError(basicError);
        setSelectedFile(null);
        return;
      }

      if (validateMagicBytes) {
        setIsValidating(true);
        try {
          const isValid = await validateFileSignature(file);
          if (!isValid) {
            setError(`Invalid file format. The file content does not match its extension.`);
            setSelectedFile(null);
            setIsValidating(false);
            return;
          }
        } catch (e) {
          console.error('Validation error:', e);
          setError('Failed to validate file. Please try again.');
          setSelectedFile(null);
          setIsValidating(false);
          return;
        }
        setIsValidating(false);
      }

      setError(null);
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
      });
      onFileSelect(file);
    },
    [validateFile, validateMagicBytes, onFileSelect],
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      if (!disabled && !isUploading) {
        setIsDragOver(true);
      }
    },
    [disabled, isUploading],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      dragCounter.current = 0;

      if (disabled || isUploading) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled, isUploading, handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  const handleRemoveFile = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedFile(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onFileRemove?.();
    },
    [onFileRemove],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={disabled || isUploading ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
          outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2
          ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-50 scale-[1.02]'
              : 'border-slate-200 hover:border-emerald-400/50 bg-slate-50/50'
          }
          ${
            disabled || isUploading || isValidating
              ? 'opacity-60 cursor-not-allowed'
              : ''
          }
          ${error ? 'border-red-300 bg-red-50/50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled || isUploading}
        />

        <div className="p-8 text-center">
          {/* Drag Over State */}
          {isDragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-50/90 rounded-xl z-10">
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto mb-3 text-emerald-600 animate-bounce" />
                <p className="text-lg font-semibold text-emerald-600">
                  Drop your file here
                </p>
              </div>
            </div>
          )}

          {/* No File Selected */}
          {!selectedFile && !isUploading && !isValidating && (
            <>
              <div className="mb-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <p className="text-lg font-semibold text-slate-900 mb-2">
                Drag & Drop Your Medical Files
              </p>
              <p className="text-sm text-slate-500 mb-4">
                or click to browse from your computer
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {accept.split(',').map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-md"
                  >
                    {type.replace('.', '').toUpperCase()}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400">
                Maximum file size: {maxSize}MB
              </p>
            </>
          )}

          {/* File Preview */}
          {selectedFile && !isUploading && !isValidating && (
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  {getFileIcon(selectedFile.type, selectedFile.name)}
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900 truncate max-w-[200px] sm:max-w-[300px]">
                    {selectedFile.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Ready to upload
                    </span>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Validating State */}
          {isValidating && (
            <div className="flex flex-col items-center justify-center p-6">
              <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-3" />
              <p className="font-medium text-slate-900">Validating file...</p>
              <p className="text-sm text-slate-500">Checking file format</p>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="h-8 w-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <span className="font-medium text-slate-900">
                  Processing...
                </span>
              </div>
              {uploadProgress > 0 && (
                <div className="w-full max-w-xs mx-auto">
                  <div className="flex justify-between text-sm text-slate-500 mb-1">
                    <span>Uploading</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              {selectedFile && (
                <p className="text-sm text-slate-500">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">Upload Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

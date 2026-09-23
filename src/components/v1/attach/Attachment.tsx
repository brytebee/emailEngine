import React, { useRef, useState, ChangeEvent, DragEvent } from "react";
import {
  Paperclip,
  Upload,
  X,
  File,
  FileText,
  Image,
  FileAudio,
  FileVideo,
  AlertCircle,
} from "lucide-react";

// Types
interface AttachmentFile {
  id: number;
  file: File;
  name: string;
  size: number;
  type: string;
  preview: string | null;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "destructive";
  disabled?: boolean;
  className?: string;
}

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

interface EmailAttachmentsProps {
  attachments?: AttachmentFile[];
  onAttachmentsChange: (attachments: AttachmentFile[]) => void;
  maxFileSize?: number;
  maxFiles?: number;
  allowedTypes?: string[];
}

// Mock UI Components (replace with your actual components)
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border ${className}`}>{children}</div>
);

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => <div className={`p-6 ${className}`}>{children}</div>;

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "default",
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2";
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50",
    destructive: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Label: React.FC<LabelProps> = ({ children, className = "" }) => (
  <label
    className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
  >
    {children}
  </label>
);

const EmailAttachments: React.FC<EmailAttachmentsProps> = ({
  attachments = [],
  onAttachmentsChange,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  allowedTypes = [
    "image/*",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  const getFileIcon = (fileType: string): JSX.Element => {
    if (fileType.startsWith("image/"))
      return <Image size={16} className="text-green-600" />;
    if (fileType.startsWith("audio/"))
      return <FileAudio size={16} className="text-purple-600" />;
    if (fileType.startsWith("video/"))
      return <FileVideo size={16} className="text-red-600" />;
    if (fileType.includes("pdf"))
      return <FileText size={16} className="text-red-500" />;
    return <File size={16} className="text-gray-600" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string[] => {
    const errors: string[] = [];

    // Check file size
    if (file.size > maxFileSize) {
      errors.push(
        `File "${file.name}" is too large. Maximum size is ${formatFileSize(
          maxFileSize
        )}.`
      );
    }

    // Check file type
    const isAllowedType = allowedTypes.some((type: string) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isAllowedType) {
      errors.push(`File type "${file.type}" is not allowed.`);
    }

    return errors;
  };

  const handleFiles = (files: FileList): void => {
    const newErrors: string[] = [];
    const validFiles: AttachmentFile[] = [];

    // Check total file count
    if (attachments.length + files.length > maxFiles) {
      newErrors.push(
        `Maximum ${maxFiles} files allowed. You're trying to add ${files.length} files to existing ${attachments.length}.`
      );
      setErrors(newErrors);
      return;
    }

    Array.from(files).forEach((file: File) => {
      // Check if file already exists
      const isDuplicate = attachments.some(
        (attachment: AttachmentFile) =>
          attachment.name === file.name && attachment.size === file.size
      );

      if (isDuplicate) {
        newErrors.push(`File "${file.name}" is already attached.`);
        return;
      }

      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        newErrors.push(...fileErrors);
      } else {
        validFiles.push({
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        });
      }
    });

    if (validFiles.length > 0) {
      onAttachmentsChange([...attachments, ...validFiles]);
    }

    setErrors(newErrors);

    // Clear errors after 5 seconds
    if (newErrors.length > 0) {
      setTimeout(() => setErrors([]), 5000);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow same file selection
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const removeAttachment = (id: number): void => {
    const updatedAttachments = attachments.filter(
      (attachment: AttachmentFile) => {
        if (attachment.id === id) {
          // Clean up preview URL if it exists
          if (attachment.preview) {
            URL.revokeObjectURL(attachment.preview);
          }
          return false;
        }
        return true;
      }
    );
    onAttachmentsChange(updatedAttachments);
  };

  const openFileDialog = (): void => {
    fileInputRef.current?.click();
  };

  const totalSize: number = attachments.reduce(
    (sum: number, attachment: AttachmentFile) => sum + attachment.size,
    0
  );

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Paperclip size={16} />
        Attachments ({attachments.length}/{maxFiles})
      </Label>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
          ${
            attachments.length >= maxFiles
              ? "opacity-50 cursor-not-allowed"
              : ""
          }
        `}
        onClick={attachments.length < maxFiles ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept={allowedTypes.join(",")}
          disabled={attachments.length >= maxFiles}
        />

        <div className="space-y-2">
          <Upload size={32} className="mx-auto text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {isDragActive
                ? "Drop files here"
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Max {formatFileSize(maxFileSize)} per file, {maxFiles} files total
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error: string, index: number) => (
            <div
              key={index}
              className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Attachment List */}
      {attachments.length > 0 && (
        <Card className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Attached Files
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Total: {formatFileSize(totalSize)}
                </span>
              </div>
              <div>
                {attachments.map((attachment: AttachmentFile) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-sm"
                  >
                    {/* File Icon/Preview */}
                    <div className="flex-shrink-0">
                      {attachment.preview ? (
                        <img
                          src={attachment.preview}
                          alt={attachment.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                          {getFileIcon(attachment.type)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="destructive"
                      onClick={() => removeAttachment(attachment.id)}
                      className="p-2 h-8 w-8"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>
          📎 Supported formats: Images, PDF, Word docs, Excel sheets, and text
          files
        </p>
        <p>
          ⚡ Files are validated before attachment and will be included with
          your email
        </p>
      </div>
    </div>
  );
};

export default EmailAttachments;

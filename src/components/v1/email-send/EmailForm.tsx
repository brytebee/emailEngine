// component/v1/email-send/EmailForm.tsx
"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  AtSign,
  Mail,
  User,
  FileText,
  Eye,
  Send,
  ArrowRight,
  AlertCircle,
  Paperclip,
  Upload,
  X,
  File,
  Image,
  FileAudio,
  FileVideo,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectItem,
} from "./UiComponents";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg", // Add explicit jpg support
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  originalName: string;
}

export default function EmailForm({
  formData,
  setFormData,
  errors,
  setErrors,
  allowedSenders,
  onPreview,
  onSubmit,
  isLoading,
}: any) {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getFileIcon = (fileType: string) => {
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

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.sender) {
      newErrors.sender = "Sender is required";
    } else if (!allowedSenders.includes(formData.sender)) {
      newErrors.sender = "Please select a valid sender email";
    }

    if (!formData.receiver) {
      newErrors.receiver = "Receiver email is required";
    } else if (!emailRegex.test(formData.receiver)) {
      newErrors.receiver = "Please enter a valid email address";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.body.trim()) {
      newErrors.body = "Email body is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFileToCloudinary = async (
    file: File
  ): Promise<AttachmentFile | null> => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_DOCS_UPLOAD_PRESET as string
      );

      // Always use 'raw' resource type for all files to avoid processing issues
      const resourceType = "raw";
      const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME as string;

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Upload failed: ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      const { secure_url, original_filename, format, bytes, public_id } = data;

      setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

      // Remove progress after successful upload
      setTimeout(() => {
        setUploadProgress((prev) => {
          const updated = { ...prev };
          delete updated[fileId];
          return updated;
        });
      }, 1000);

      return {
        id: fileId,
        name: original_filename || file.name,
        size: bytes || file.size,
        type: file.type,
        url: secure_url,
        originalName: file.name,
      };
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
      return null;
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const newErrors: string[] = [];

    // Check total file count
    if (attachments.length + files.length > MAX_FILES) {
      setErrors((prev: any) => ({
        ...prev,
        attachments: `Maximum ${MAX_FILES} files allowed. You're trying to add ${files.length} files to existing ${attachments.length}.`,
      }));
      return;
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(
          `File "${file.name}" is too large. Maximum size is ${formatFileSize(
            MAX_FILE_SIZE
          )}.`
        );
        return null;
      }

      // Validate file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        newErrors.push(
          `File type "${file.type}" is not allowed for "${file.name}".`
        );
        return null;
      }

      // Check for duplicates
      const isDuplicate = attachments.some(
        (attachment) =>
          attachment.originalName === file.name && attachment.size === file.size
      );

      if (isDuplicate) {
        newErrors.push(`File "${file.name}" is already attached.`);
        return null;
      }

      return await uploadFileToCloudinary(file);
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    const validFiles = uploadedFiles.filter(
      (file): file is AttachmentFile => file !== null
    );

    if (validFiles.length > 0) {
      setAttachments((prev) => [...prev, ...validFiles]);
    }

    if (newErrors.length > 0) {
      setErrors((prev: any) => ({
        ...prev,
        attachments: newErrors.join(" "),
      }));

      // Clear attachment errors after 5 seconds
      setTimeout(() => {
        setErrors((prev: any) => {
          const updated = { ...prev };
          delete updated.attachments;
          return updated;
        });
      }, 5000);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  const openFileDialog = () => {
    if (attachments.length < MAX_FILES) {
      fileInputRef.current?.click();
    }
  };

  const isFormValid = () => {
    return (
      allowedSenders.includes(formData.sender) &&
      emailRegex.test(formData.receiver) &&
      formData.firstName.trim() !== "" &&
      formData.subject.trim() !== "" &&
      formData.body.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Include attachments in form data
    const emailData = {
      ...formData,
      attachments: attachments.map((attachment) => ({
        id: attachment.id,
        name: attachment.name,
        size: attachment.size,
        type: attachment.type,
        url: attachment.url,
        originalName: attachment.originalName,
      })),
    };

    onSubmit(emailData);
  };

  const totalSize = attachments.reduce(
    (sum, attachment) => sum + attachment.size,
    0
  );
  const hasUploadsInProgress = Object.keys(uploadProgress).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-600" />
            Email Composition
          </CardTitle>
          <CardDescription>
            All fields are required. Your email will be sent securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sender" className="flex items-center gap-2">
                <AtSign size={16} />
                Sender Email *
              </Label>
              <Select
                value={formData.sender}
                onValueChange={(value: any) =>
                  handleInputChange("sender", value)
                }
              >
                {allowedSenders.map((email: any) => (
                  <SelectItem key={email} value={email}>
                    {email}
                  </SelectItem>
                ))}
              </Select>
              {errors.sender && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.sender}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiver" className="flex items-center gap-2">
                <Mail size={16} />
                Recipient Email *
              </Label>
              <Input
                id="receiver"
                type="email"
                value={formData.receiver}
                onChange={(e: any) =>
                  handleInputChange("receiver", e.target.value)
                }
                placeholder="recipient@example.com"
                className={errors.receiver ? "border-red-500" : ""}
              />
              {errors.receiver && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.receiver}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-2">
              <User size={16} />
              Recipient First Name *
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e: any) =>
                handleInputChange("firstName", e.target.value)
              }
              placeholder="Enter recipient's first name"
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="flex items-center gap-2">
              <FileText size={16} />
              Email Subject *
            </Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e: any) =>
                handleInputChange("subject", e.target.value)
              }
              placeholder="Enter email subject"
              className={errors.subject ? "border-red-500" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.subject}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="body" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Email Content *
            </Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e: any) => handleInputChange("body", e.target.value)}
              placeholder="Enter your email message here..."
              rows={6}
              className={errors.body ? "border-red-500" : ""}
            />
            {errors.body && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.body}
              </p>
            )}
          </div>

          {/* File Attachments Section */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Paperclip size={16} />
              Attachments ({attachments.length}/{MAX_FILES})
            </Label>

            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
                ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }
                ${
                  attachments.length >= MAX_FILES
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
              onClick={openFileDialog}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                accept={ACCEPTED_FILE_TYPES.join(",")}
                disabled={attachments.length >= MAX_FILES}
              />

              <motion.div
                className="space-y-2"
                animate={{ scale: isDragActive ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Upload size={32} className="mx-auto text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {isDragActive
                      ? "Drop files here"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Max {formatFileSize(MAX_FILE_SIZE)} per file, {MAX_FILES}{" "}
                    files total
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Upload Progress */}
            <AnimatePresence>
              {hasUploadsInProgress && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {Object.entries(uploadProgress).map(([fileId, progress]) => (
                    <div
                      key={fileId}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Upload size={16} className="text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Uploading...
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Attachment List */}
            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Attached Files
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Total: {formatFileSize(totalSize)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <motion.div
                        key={attachment.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-sm"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                            {getFileIcon(attachment.type)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <Button
                            variant="destructive"
                            onClick={() => removeAttachment(attachment.id)}
                            className="p-2 h-8 w-8"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File Info */}
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>
                📎 Supported formats: Images, PDF, Word docs, Excel sheets, and
                text files
              </p>
              <p>
                ☁️ Files are uploaded to secure cloud storage and attached to
                your email
              </p>
            </div>
          </div>

          {/* Error Messages */}
          {(errors.general || errors.attachments) && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {errors.general && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.general}
                    </p>
                  </div>
                )}
                {errors.attachments && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.attachments}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              onClick={onPreview}
              disabled={!isFormValid() || hasUploadsInProgress}
              className="flex-1 gap-2"
            >
              <Eye size={16} />
              Preview Email
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isLoading || hasUploadsInProgress}
              className="flex-1 gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Email
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🔒 All emails and attachments are sent securely with automatic
              logout after 5 minutes of inactivity
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

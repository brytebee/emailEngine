import React from "react";
import { motion } from "framer-motion";
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    onSubmit();
  };

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

          {errors.general && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.general}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              onClick={onPreview}
              disabled={!isFormValid()}
              className="flex-1 gap-2"
            >
              <Eye size={16} />
              Preview Email
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isLoading}
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
              🔒 All emails are sent securely with automatic logout after 5
              minutes of inactivity
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

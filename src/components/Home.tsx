// components/Home.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Link as LinkIcon,
  ArrowLeft,
  X,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";

// Import confirmation email templates
import ConfirmEmail from "@/components/confirm/Confirm";
import CorporateConfirmEmail from "@/components/confirm/ConfirmCorporate";
import ElegantConfirmEmail from "@/components/confirm/ConfirmElegant";
import MinimalConfirmEmail from "@/components/confirm/ConfirmMinimal";
import TechConfirmEmail from "@/components/confirm/ConfirmTech";

// Import URL verification email templates
import UrlVerify from "@/components/url-verify/UrlVerify";
import UrlVerifyCorporate from "@/components/url-verify/UrlVerifyCorporate";
import UrlVerifyCreative from "@/components/url-verify/UrlVerifyCreative";
import UrlVerifyMinimalist from "@/components/url-verify/UrlVerifyMinimalist";
import UrlVerifyTech from "@/components/url-verify/UrlVerifyTech";

// Sample data for the templates
const sampleData = {
  code: "423956",
  firstName: "Alex",
  product: "TechVerse Academy",
  imageUrl: "/images/techverse-logo.png",
  verifyUrl:
    "https://techverseacademy.com/verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
};

// Template data
const confirmTemplates = [
  {
    id: "default",
    type: "confirmation",
    title: "Default Confirmation",
    description:
      "Classic design with straightforward verification code display",
    imageSrc: "/templates/confirm-default.png",
    component: ConfirmEmail,
    tags: ["Classic", "Simple"],
  },
  {
    id: "corporate",
    type: "confirmation",
    title: "Corporate Style",
    description: "Professional design suitable for business applications",
    imageSrc: "/templates/confirm-corporate.png",
    component: CorporateConfirmEmail,
    tags: ["Professional", "Business"],
  },
  {
    id: "elegant",
    type: "confirmation",
    title: "Elegant Design",
    description: "Sophisticated layout with refined typography",
    imageSrc: "/templates/confirm-elegant.png",
    component: ElegantConfirmEmail,
    tags: ["Sophisticated", "Premium"],
  },
  {
    id: "minimal",
    type: "confirmation",
    title: "Minimal Style",
    description: "Clean and simple design focusing on essential information",
    imageSrc: "/templates/confirm-minimal.png",
    component: MinimalConfirmEmail,
    tags: ["Clean", "Minimal"],
  },
  {
    id: "tech",
    type: "confirmation",
    title: "Tech Modern",
    description: "Contemporary design with vibrant colors for tech companies",
    imageSrc: "/templates/confirm-tech.png",
    component: TechConfirmEmail,
    tags: ["Modern", "Vibrant"],
  },
];

const urlTemplates = [
  {
    id: "default",
    type: "url",
    title: "Standard URL Verification",
    description: "Clean design with verification link",
    imageSrc: "/templates/url-default.png",
    component: UrlVerify,
    tags: ["Standard", "Clean"],
  },
  {
    id: "corporate",
    type: "url",
    title: "Corporate URL Verify",
    description: "Professional design with branded elements",
    imageSrc: "/templates/url-corporate.png",
    component: UrlVerifyCorporate,
    tags: ["Professional", "Branded"],
  },
  {
    id: "creative",
    type: "url",
    title: "Creative URL Verify",
    description: "Eye-catching design with unique visual elements",
    imageSrc: "/templates/url-creative.png",
    component: UrlVerifyCreative,
    tags: ["Creative", "Unique"],
  },
  {
    id: "minimalist",
    type: "url",
    title: "Minimalist URL Verify",
    description: "Ultra-clean design focusing on the verification button",
    imageSrc: "/templates/url-minimalist.png",
    component: UrlVerifyMinimalist,
    tags: ["Minimal", "Clean"],
  },
  {
    id: "tech",
    type: "url",
    title: "Tech-Oriented Verify",
    description: "Modern design catered to technology companies",
    imageSrc: "/templates/url-tech.png",
    component: UrlVerifyTech,
    tags: ["Modern", "Tech"],
  },
];

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const { theme, setTheme } = useTheme();

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
  };

  const closeDetailView = () => {
    setSelectedTemplate(null);
  };

  // Template card component
  const TemplateCard = ({ template }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer group"
        onClick={() => handleSelectTemplate(template)}
      >
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-900 relative">
          {template.imageSrc ? (
            <Image
              src={template.imageSrc}
              alt={template.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {template.type === "confirmation" ? (
                <Mail size={48} className="opacity-30" />
              ) : (
                <LinkIcon size={48} className="opacity-30" />
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button variant="default" className="shadow-lg">
              Preview
              <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">{template.title}</CardTitle>
          <CardDescription>{template.description}</CardDescription>
        </CardHeader>
        <CardFooter className="p-4 pt-0 flex gap-2 flex-wrap">
          {template.tags.map((tag: any) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  );

  const DetailViewModal = ({
    template,
    onClose,
  }: {
    template: any;
    onClose: () => void;
  }) => {
    const TemplateComponent = template.component;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="bg-white dark:bg-neutral-900 rounded-xl relative shadow-2xl max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Back and Close Buttons */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50 rounded-t-xl">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="gap-2"
              >
                <ArrowLeft size={16} />
                Back to Gallery
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">{template.title}</h2>
              <div className="border rounded-lg p-6 mb-6 bg-slate-50 dark:bg-neutral-800">
                <TemplateComponent {...sampleData} />
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {template.tags.map((tag: any) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-black">
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/90 dark:bg-black/90 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Mail size={20} />
            </div>
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              EmailTemplates
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            Email Template Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Professional email templates for your next project. Click on any
            template to preview.
          </motion.p>
        </div>

        <Tabs defaultValue="confirmation" className="w-full max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="confirmation" className="gap-2">
                <Mail size={16} />
                Confirmation
              </TabsTrigger>
              <TabsTrigger value="url" className="gap-2">
                <LinkIcon size={16} />
                URL Verify
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="confirmation" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {confirmTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {urlTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 mt-16 py-12 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <Mail size={16} />
              </div>
              <span className="font-semibold">EmailTemplates</span>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} GreenCode. All rights reserved.
            </p>

            <div className="flex space-x-6">
              <Link
                href="#"
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Detail View Modal */}

      {selectedTemplate && (
        <DetailViewModal
          template={selectedTemplate}
          onClose={closeDetailView}
        />
      )}
    </div>
  );
}

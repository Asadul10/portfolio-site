'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gallery } from '@/components/gallery';
import { PDFViewerRobust } from '@/components/pdf-viewer-robust';
import { Project } from '@/types';
import { formatDate } from '@/lib/utils';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Back Button */}
          <Link href="/projects">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Projects
            </Button>
          </Link>

          {/* Project Header */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {project.year}
                </Badge>
                <Badge variant="outline">{project.category}</Badge>
              </div>
              
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                {project.title}
              </h1>
              
              <p className="text-xl text-muted-foreground">
                {project.summary}
              </p>
            </div>

            {/* Project Links */}
            {project.links && (
              <div className="flex flex-wrap gap-4">
                {project.links.demo && (
                  <Button asChild>
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Demo
                    </a>
                  </Button>
                )}
                {project.links.repo && (
                  <Button variant="outline" asChild>
                    <a
                      href={project.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </a>
                  </Button>
                )}
                {project.links.docs && (
                  <Button variant="outline" asChild>
                    <a
                      href={project.links.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Documentation
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src={project.cover}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Project Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {project.content && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none dark:prose-invert">
                      {/* This would be rendered from MDX content */}
                      <div dangerouslySetInnerHTML={{ __html: project.content }} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Gallery */}
              {project.images && project.images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Gallery</CardTitle>
                    <CardDescription>
                      Screenshots and visual documentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Main Image Display */}
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={project.images[activeImageIndex]?.src || project.cover}
                          alt={project.images[activeImageIndex]?.caption || project.title}
                          fill
                          className="object-cover"
                        />
                        {project.images.length > 1 && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute left-2 top-1/2 transform -translate-y-1/2"
                              onClick={() => setActiveImageIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length)}
                            >
                              <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={() => setActiveImageIndex((prev) => (prev + 1) % project.images!.length)}
                            >
                              <ArrowLeft className="h-4 w-4 rotate-180" />
                            </Button>
                          </>
                        )}
                      </div>
                      
                      {/* Caption */}
                      {project.images[activeImageIndex]?.caption && (
                        <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                          <p className="text-sm text-gray-700">
                            {project.images[activeImageIndex].caption}
                          </p>
                        </div>
                      )}
                      
                      {/* Thumbnail Navigation */}
                      {project.images.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                          {project.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImageIndex(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                index === activeImageIndex 
                                  ? 'border-blue-500' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Image
                                src={image.src}
                                alt={image.caption || `Image ${index + 1}`}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* PDF Documents */}
              {project.pdfs && project.pdfs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>
                      Reports, guides, and additional resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.pdfs.map((pdf, index) => (
                      <div key={`${pdf.src}-${index}`} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">
                              {pdf.title}
                              {project.pdfs.filter(p => p.title === pdf.title).length > 1 && (
                                <span className="text-sm text-gray-500 ml-2">({index + 1})</span>
                              )}
                            </h4>
                            {pdf.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{pdf.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Toggle PDF visibility
                                const pdfViewer = document.getElementById(`pdf-viewer-${index}`);
                                const viewButton = document.getElementById(`view-button-${index}`);
                                if (pdfViewer && viewButton) {
                                  const isHidden = pdfViewer.style.display === 'none';
                                  pdfViewer.style.display = isHidden ? 'block' : 'none';
                                  const span = viewButton.querySelector('span');
                                  if (span) {
                                    span.textContent = isHidden ? 'Hide' : 'View';
                                  }
                                }
                              }}
                              id={`view-button-${index}`}
                              className="flex items-center space-x-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>View</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = pdf.src;
                                link.download = pdf.title;
                                link.click();
                              }}
                              className="flex items-center space-x-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </Button>
                          </div>
                        </div>
                        <div id={`pdf-viewer-${index}`} style={{ display: 'none' }}>
                          <div className="mb-2 text-xs text-gray-500">
                            PDF Path: {pdf.src} | Full URL: {typeof window !== 'undefined' ? `${window.location.origin}${pdf.src}` : 'Loading...'}
                          </div>
                          <PDFViewerRobust
                            src={pdf.src}
                            title={pdf.title}
                            description={pdf.description}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Notes & Learnings */}
              {project.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes & Learnings</CardTitle>
                    <CardDescription>
                      Key insights and lessons learned from this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: project.notes }} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tech Stack */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                    <p className="text-sm">{project.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Year</h4>
                    <p className="text-sm">{project.year}</p>
                  </div>
                  {project.links && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Links</h4>
                      <div className="space-y-2">
                        {project.links.demo && (
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-primary-600 hover:underline"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.links.repo && (
                          <a
                            href={project.links.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-primary-600 hover:underline"
                          >
                            Source Code
                          </a>
                        )}
                        {project.links.docs && (
                          <a
                            href={project.links.docs}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-primary-600 hover:underline"
                          >
                            Documentation
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

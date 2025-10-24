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
import { PDFViewer } from '@/components/pdf-viewer';
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
                    <Gallery
                      images={project.images}
                      activeIndex={activeImageIndex}
                      onImageChange={setActiveImageIndex}
                    />
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
                      <PDFViewer
                        key={index}
                        src={pdf.src}
                        title={pdf.title}
                        description={pdf.description}
                      />
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

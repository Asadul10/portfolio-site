'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types';
import { formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card 
      className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      data-testid="project-card"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
        <div className="absolute top-4 right-4 flex space-x-2">
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/90 p-2 text-gray-900 opacity-0 transition-all group-hover:opacity-100"
              aria-label="View demo"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.links?.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/90 p-2 text-gray-900 opacity-0 transition-all group-hover:opacity-100"
              aria-label="View repository"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2 group-hover:text-primary-600 transition-colors">
            {project.title}
          </CardTitle>
          <Badge variant="secondary" className="ml-2 shrink-0">
            <Calendar className="mr-1 h-3 w-3" />
            {project.year}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {project.summary}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Link
          href={`/projects/${project.slug}`}
          className="w-full"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            View Details
          </motion.div>
        </Link>
      </CardFooter>
    </Card>
  );
}

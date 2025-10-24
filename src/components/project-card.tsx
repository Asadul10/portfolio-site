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
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card 
        className="group h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 border-2 hover:border-primary-200 dark:hover:border-primary-800"
        data-testid="project-card"
      >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        
        {/* Overlay content */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1 }}
            className="flex space-x-3"
          >
            {project.links?.demo && (
              <motion.a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/95 p-3 text-gray-900 shadow-lg hover:bg-white transition-colors"
                aria-label="View demo"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink className="h-5 w-5" />
              </motion.a>
            )}
            {project.links?.repo && (
              <motion.a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/95 p-3 text-gray-900 shadow-lg hover:bg-white transition-colors"
                aria-label="View repository"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="h-5 w-5" />
              </motion.a>
            )}
          </motion.div>
        </div>
        
        {/* Top right badges */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Badge className="bg-primary-600 text-white shadow-lg">
            {project.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <CardTitle className="line-clamp-2 group-hover:text-primary-600 transition-colors text-lg">
            {project.title}
          </CardTitle>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              <Calendar className="mr-1 h-3 w-3" />
              {project.year}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {project.tags.length} technologies
            </div>
          </div>
        </div>
        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
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
      
      <CardFooter className="pt-4">
        <Link
          href={`/projects/${project.slug}`}
          className="w-full"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-md bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-all duration-300 hover:from-primary-700 hover:to-accent-700 hover:shadow-lg"
          >
            View Details
          </motion.div>
        </Link>
      </CardFooter>
      </Card>
    </motion.div>
  );
}

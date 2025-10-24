'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCard } from '@/components/project-card';
import { Project, ProjectCategory } from '@/types';
import { siteConfig } from '@/lib/config';
import { debounce } from '@/lib/utils';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([2020, 2025]);

  // Get unique tags from all projects
  const allTags = useMemo(() => {
    const tags = projects.flatMap(project => project.tags);
    return Array.from(new Set(tags)).sort();
  }, [projects]);

  // Filter projects based on search, category, tags, and year range
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => project.tags.includes(tag));

      const matchesYearRange = project.year >= yearRange[0] && project.year <= yearRange[1];

      return matchesSearch && matchesCategory && matchesTags && matchesYearRange;
    });
  }, [projects, searchQuery, selectedCategory, selectedTags, yearRange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTags([]);
    setYearRange([2020, 2025]);
  };

  const debouncedSearch = debounce(setSearchQuery, 300);

  return (
    <section className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              My Projects
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A collection of my work in cybersecurity, web development, and networking
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="shrink-0"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ProjectCategory | 'All')}>
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="All">All</TabsTrigger>
                {siteConfig.projectCategories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Tags */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Filter by tags:</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors hover:bg-primary-100"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Year Range */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Year Range:</h3>
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  placeholder="From"
                  value={yearRange[0]}
                  onChange={(e) => setYearRange([parseInt(e.target.value) || 2020, yearRange[1]])}
                  className="w-24"
                />
                <span>to</span>
                <Input
                  type="number"
                  placeholder="To"
                  value={yearRange[1]}
                  onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value) || 2025])}
                  className="w-24"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No projects found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

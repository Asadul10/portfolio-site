'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Project, ProjectCategory } from '@/types';
import { X, Save, Eye } from 'lucide-react';

interface ProjectEditorProps {
  project?: Project | null;
  onSave: () => void;
  onCancel: () => void;
}

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Web Apps',
  'Cybersecurity Labs',
  'Networking',
  'Data/ML',
  'Other',
];

export default function MDXProjectEditor({ project, onSave, onCancel }: ProjectEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Apps' as ProjectCategory,
    year: new Date().getFullYear(),
    tags: [] as string[],
    summary: '',
    cover: '',
    featured: false,
    content: '',
    notes: '',
    links: {
      demo: '',
      repo: '',
      docs: '',
    },
    images: [] as Array<{ src: string; caption?: string }>,
    pdfs: [] as Array<{ src: string; title: string; description?: string }>,
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        category: project.category,
        year: project.year,
        tags: project.tags || [],
        summary: project.summary,
        cover: project.cover,
        featured: project.featured || false,
        content: project.content || '',
        notes: project.notes || '',
        links: project.links || { demo: '', repo: '', docs: '' },
        images: project.images || [],
        pdfs: project.pdfs || [],
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = project 
        ? `/api/admin/projects/${project.slug}`
        : '/api/admin/projects';
      
      const method = project ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: project ? 'Project updated successfully' : 'Project created successfully',
        });
        onSave();
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.message || 'Failed to save project',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving the project',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const generateMDXPreview = () => {
    return `---
title: "${formData.title}"
category: "${formData.category}"
year: ${formData.year}
tags: [${formData.tags.map(tag => `"${tag}"`).join(', ')}]
summary: "${formData.summary}"
cover: "${formData.cover}"
featured: ${formData.featured}
${formData.images.length > 0 ? `images:
${formData.images.map(img => `  - src: "${img.src}"${img.caption ? `\n    caption: "${img.caption}"` : ''}`).join('\n')}` : ''}
${formData.pdfs.length > 0 ? `pdfs:
${formData.pdfs.map(pdf => `  - src: "${pdf.src}"\n    title: "${pdf.title}"${pdf.description ? `\n    description: "${pdf.description}"` : ''}`).join('\n')}` : ''}
${Object.values(formData.links).some(link => link) ? `links:
  ${formData.links.demo ? `demo: "${formData.links.demo}"` : ''}
  ${formData.links.repo ? `repo: "${formData.links.repo}"` : ''}
  ${formData.links.docs ? `docs: "${formData.links.docs}"` : ''}` : ''}
---

${formData.content || ''}

${formData.notes ? `## Notes & Learnings

${formData.notes}` : ''}
`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Project Editor</h3>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview MDX'}
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="space-y-4">
          <h4 className="font-medium">MDX File Preview</h4>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {generateMDXPreview()}
          </pre>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Project title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ProjectCategory }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                min="2020"
                max="2030"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover">Cover Image URL *</Label>
              <Input
                id="cover"
                value={formData.cover}
                onChange={(e) => setFormData(prev => ({ ...prev, cover: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary *</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Brief description of the project"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tags *</Label>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag"
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-md text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Detailed project description (Markdown supported)"
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes & Learnings</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Key insights and lessons learned"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="demo">Demo URL</Label>
              <Input
                id="demo"
                value={formData.links.demo}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  links: { ...prev.links, demo: e.target.value }
                }))}
                placeholder="https://demo.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo">Repository URL</Label>
              <Input
                id="repo"
                value={formData.links.repo}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  links: { ...prev.links, repo: e.target.value }
                }))}
                placeholder="https://github.com/user/repo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="docs">Documentation URL</Label>
              <Input
                id="docs"
                value={formData.links.docs}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  links: { ...prev.links, docs: e.target.value }
                }))}
                placeholder="https://docs.example.com"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Featured project</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

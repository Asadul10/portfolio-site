'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, FileText } from 'lucide-react';

interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export default function MDXSiteConfigManager() {
  const [config, setConfig] = useState<SiteConfig>({
    name: '',
    tagline: '',
    description: '',
    email: '',
    github: '',
    linkedin: '',
    twitter: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/site-config', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch site configuration',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching site config:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while fetching site configuration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Site configuration updated successfully in MDX file',
        });
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.message || 'Failed to update site configuration',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving site config:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving site configuration',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof SiteConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateMDXPreview = () => {
    return `---
title: "Site Configuration"
type: "site-config"
---

# Site Configuration

## Basic Information
- **Name**: ${config.name}
- **Tagline**: ${config.tagline}
- **Description**: ${config.description}
- **Email**: ${config.email}

## Social Links
- **GitHub**: ${config.github}
- **LinkedIn**: ${config.linkedin}
- **Twitter**: ${config.twitter}
`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">MDX Site Configuration</h2>
          <p className="text-gray-600">Manage site settings using MDX file in content/admin/site-config.mdx</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview MDX'}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save to MDX'}
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
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Core information displayed on your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline *</Label>
                <Input
                  id="tagline"
                  value={config.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="Your professional tagline"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of yourself and your work"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={config.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Links to your social profiles and professional accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub *</Label>
                <Input
                  id="github"
                  type="url"
                  value={config.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn *</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={config.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter *</Label>
                <Input
                  id="twitter"
                  type="url"
                  value={config.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            How your information will appear on the site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.name || 'Your Name'}</h1>
            <p className="text-xl text-gray-600 mb-4">{config.tagline || 'Your Tagline'}</p>
            <p className="text-gray-700 mb-6">{config.description || 'Your description will appear here'}</p>
            <div className="flex space-x-4 text-sm text-gray-600">
              <span>📧 {config.email || 'your.email@example.com'}</span>
              <span>🐙 {config.github || 'GitHub'}</span>
              <span>💼 {config.linkedin || 'LinkedIn'}</span>
              <span>🐦 {config.twitter || 'Twitter'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

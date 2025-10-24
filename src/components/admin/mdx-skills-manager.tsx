'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SkillCategory } from '@/types';
import { Plus, Save, FileText, Eye } from 'lucide-react';

export default function MDXSkillsManager() {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const fetchSkills = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/skills', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch skills',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while fetching skills',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSaveSkills = async () => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(skills),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Skills updated successfully in MDX file',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update skills',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving skills:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving skills',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = () => {
    setSkills(prev => [...prev, { name: '', skills: [] }]);
  };

  const updateCategoryName = (index: number, name: string) => {
    setSkills(prev => prev.map((cat, i) => 
      i === index ? { ...cat, name } : cat
    ));
  };

  const addSkill = (categoryIndex: number) => {
    setSkills(prev => prev.map((cat, i) => 
      i === categoryIndex 
        ? { ...cat, skills: [...cat.skills, ''] }
        : cat
    ));
  };

  const updateSkill = (categoryIndex: number, skillIndex: number, skill: string) => {
    setSkills(prev => prev.map((cat, i) => 
      i === categoryIndex 
        ? { 
            ...cat, 
            skills: cat.skills.map((s, j) => j === skillIndex ? skill : s)
          }
        : cat
    ));
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    setSkills(prev => prev.map((cat, i) => 
      i === categoryIndex 
        ? { 
            ...cat, 
            skills: cat.skills.filter((_, j) => j !== skillIndex)
          }
        : cat
    ));
  };

  const removeCategory = (index: number) => {
    if (confirm('Are you sure you want to delete this skill category?')) {
      setSkills(prev => prev.filter((_, i) => i !== index));
    }
  };

  const generateMDXPreview = () => {
    const content = skills.map(category => 
      `## ${category.name}\n${category.skills.map(skill => `- ${skill}`).join('\n')}`
    ).join('\n\n');

    return `---
title: "Skills Configuration"
type: "skills"
---

# Skills Configuration

${content}
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
          <h2 className="text-2xl font-bold text-gray-900">MDX Skills</h2>
          <p className="text-gray-600">Manage skills using MDX file in content/admin/skills.mdx</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview MDX'}
          </Button>
          <Button onClick={handleSaveSkills} disabled={isSaving}>
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
          {skills.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <input
                      value={category.name}
                      onChange={(e) => updateCategoryName(categoryIndex, e.target.value)}
                      placeholder="Category name"
                      className="text-lg font-semibold bg-transparent border-none outline-none w-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCategory(categoryIndex)}
                    className="text-red-600 hover:text-red-700 ml-2"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center space-x-2">
                      <input
                        value={skill}
                        onChange={(e) => updateSkill(categoryIndex, skillIndex, e.target.value)}
                        placeholder="Skill name"
                        className="flex-1 bg-transparent border-none outline-none"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSkill(categoryIndex, skillIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(categoryIndex)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {skills.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No skill categories yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Get started by creating your first skill category
            </p>
            <Button onClick={addCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

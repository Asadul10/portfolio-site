'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types';
import { LogOut, Plus, Edit, Trash2, Eye, Save, FileText } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function MDXAdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    summary: '',
    category: '',
    tags: '',
    cover: '',
    slug: '',
    content: '',
    featured: false
  });
  const [uploadedImages, setUploadedImages] = useState<{file: File, preview: string, caption: string}[]>([]);
  const [uploadedPDFs, setUploadedPDFs] = useState<{file: File, preview: string, title: string, description: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchProjects();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateProject = () => {
    console.log('Creating new MDX project...');
    setFormData({
      title: '',
      year: new Date().getFullYear().toString(),
      summary: '',
      category: '',
      tags: '',
      cover: '',
      slug: '',
      content: '',
      featured: false
    });
    setUploadedImages([]);
    setUploadedPDFs([]);
    setEditingProject(null);
    setIsCreating(true);
    setIsEditing(true);
    console.log('Create MDX project state set:', { isCreating: true, isEditing: true });
  };

  const handleEditProject = (project: Project) => {
    setFormData({
      title: project.title,
      year: project.year.toString(),
      summary: project.summary,
      category: project.category,
      tags: project.tags?.join(', ') || '',
      cover: project.cover || '',
      slug: project.slug,
      content: project.content || '',
      featured: project.featured || false
    });
    
    // Load existing images and PDFs - don't create empty file objects
    const existingImages = project.images?.map(img => ({
      file: null as any, // No file object for existing images
      preview: img.src,
      caption: img.caption || '',
      isExisting: true
    })) || [];
    
    const existingPDFs = project.pdfs?.map(pdf => ({
      file: null as any, // No file object for existing PDFs
      preview: pdf.src,
      title: pdf.title,
      description: pdf.description || '',
      isExisting: true
    })) || [];
    
    setUploadedImages(existingImages);
    setUploadedPDFs(existingPDFs);
    setEditingProject(project);
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleSaveProject = async () => {
    try {
      let mediaData = null;
      
      // Separate new uploads from existing media
      const newImages = uploadedImages.filter(img => !(img as any).isExisting);
      const newPDFs = uploadedPDFs.filter(pdf => !(pdf as any).isExisting);
      const existingImages = uploadedImages.filter(img => (img as any).isExisting);
      const existingPDFs = uploadedPDFs.filter(pdf => (pdf as any).isExisting);
      
      // Upload new media files if any
      if (newImages.length > 0 || newPDFs.length > 0) {
        setIsUploading(true);
        const formData = new FormData();
        
        // Add only new images
        newImages.forEach((img, index) => {
          if (img.file) {
            formData.append(`images`, img.file);
            formData.append(`image_captions`, img.caption);
          }
        });
        
        // Add only new PDFs
        newPDFs.forEach((pdf, index) => {
          if (pdf.file) {
            formData.append(`pdfs`, pdf.file);
            formData.append(`pdf_titles`, pdf.title);
            formData.append(`pdf_descriptions`, pdf.description);
          }
        });

        try {
          console.log('Uploading new media files:', {
            images: newImages.length,
            pdfs: newPDFs.length
          });

          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Upload successful:', data);
            mediaData = data;
          } else {
            const errorData = await response.json();
            console.error('Upload failed:', errorData);
            throw new Error(errorData.error || 'Upload failed');
          }
        } catch (error) {
          console.error('Error uploading media:', error);
          toast({
            title: 'Upload Error',
            description: 'Failed to upload media files',
            variant: 'destructive',
          });
          throw error;
        } finally {
          setIsUploading(false);
        }
      }

      // Combine existing and new media
      const allImages = [
        ...existingImages.map(img => ({ src: img.preview, caption: img.caption })),
        ...(mediaData?.images || [])
      ];
      
      const allPDFs = [
        ...existingPDFs.map(pdf => ({ 
          src: pdf.preview, 
          title: pdf.title, 
          description: pdf.description 
        })),
        ...(mediaData?.pdfs || [])
      ];

      const projectData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        year: parseInt(formData.year),
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        images: allImages,
        pdfs: allPDFs
      };

      const url = isCreating 
        ? '/api/admin/projects' 
        : `/api/admin/projects/${editingProject?.slug}`;
      
      const method = isCreating ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Project ${isCreating ? 'created' : 'updated'} successfully`,
        });
        setIsEditing(false);
        setIsCreating(false);
        setEditingProject(null);
        setUploadedImages([]);
        setUploadedPDFs([]);
        fetchProjects();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || `Failed to ${isCreating ? 'create' : 'update'} project`,
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
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Project deleted successfully',
        });
        fetchProjects();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete project',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the project',
        variant: 'destructive',
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingProject(null);
    setFormData({
      title: '',
      year: '',
      summary: '',
      category: '',
      tags: '',
      cover: '',
      slug: '',
      content: '',
      featured: false
    });
    setUploadedImages([]);
    setUploadedPDFs([]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          setUploadedImages(prev => [...prev, {
            file,
            preview,
            caption: ''
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handlePDFUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          const baseTitle = file.name.replace('.pdf', '');
          
          // Check for duplicate titles and add number if needed
          setUploadedPDFs(prev => {
            let title = baseTitle;
            let counter = 1;
            
            while (prev.some(pdf => pdf.title === title)) {
              title = `${baseTitle} (${counter})`;
              counter++;
            }
            
            return [...prev, {
              file,
              preview,
              title,
              description: ''
            }];
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removePDF = (index: number) => {
    setUploadedPDFs(prev => prev.filter((_, i) => i !== index));
  };

  const updateImageCaption = (index: number, caption: string) => {
    setUploadedImages(prev => prev.map((img, i) => 
      i === index ? { ...img, caption } : img
    ));
  };

  const updatePDFDetails = (index: number, field: 'title' | 'description', value: string) => {
    setUploadedPDFs(prev => prev.map((pdf, i) => 
      i === index ? { ...pdf, [field]: value } : pdf
    ));
  };

  const uploadMediaFiles = async () => {
    if (uploadedImages.length === 0 && uploadedPDFs.length === 0) {
      return null;
    }

    setIsUploading(true);
    const formData = new FormData();
    
    // Add images
    uploadedImages.forEach((img, index) => {
      formData.append(`images`, img.file);
      formData.append(`image_captions`, img.caption);
    });
    
    // Add PDFs
    uploadedPDFs.forEach((pdf, index) => {
      formData.append(`pdfs`, pdf.file);
      formData.append(`pdf_titles`, pdf.title);
      formData.append(`pdf_descriptions`, pdf.description);
    });

    try {
      console.log('Uploading media files:', {
        images: uploadedImages.length,
        pdfs: uploadedPDFs.length
      });

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        return data;
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        throw new Error(errorData.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload media files',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">MDX Admin Dashboard</h1>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin/simple')}
                  className="flex items-center space-x-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <Edit className="h-4 w-4" />
                  <span>Simple Admin</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Site</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">MDX Projects</h2>
              <p className="text-gray-600">Manage projects using MDX files with media uploads</p>
            </div>
            <Button 
              onClick={handleCreateProject}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.slug} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {project.cover ? (
                    <img
                      src={project.cover}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FileText className="h-12 w-12" />
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center justify-between">
                      <span>{project.category}</span>
                      <span>{project.year}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {project.summary}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProject(project)}
                      className="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 font-medium"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
                      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProject(project.slug)}
                      className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {projects.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 text-center mb-4">
                  Get started by creating your first MDX project
                </p>
                <Button 
                  onClick={handleCreateProject}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Edit/Create Project Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {isCreating ? 'Create New MDX Project' : 'Edit MDX Project'}
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year *
                    </label>
                    <Input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      <option value="Web Apps">Web Apps</option>
                      <option value="Cybersecurity Labs">Cybersecurity Labs</option>
                      <option value="Networking">Networking</option>
                      <option value="Data/ML">Data/ML</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="project-slug (auto-generated if empty)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image URL
                  </label>
                  <Input
                    value={formData.cover}
                    onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="React, TypeScript, Node.js (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Summary *
                  </label>
                  <Textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief description of the project..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (Markdown)
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Detailed project description (Markdown supported)..."
                    rows={6}
                  />
                </div>

                {/* Photo Upload Section */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Project Photos</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">You can select multiple images at once</p>
                    </div>

                    {/* Image Previews */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {uploadedImages.map((img, index) => (
                          <div key={index} className="relative border rounded-lg p-2">
                            <img
                              src={img.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                              ×
                            </button>
                            <input
                              type="text"
                              placeholder="Image caption..."
                              value={img.caption}
                              onChange={(e) => updateImageCaption(index, e.target.value)}
                              className="w-full mt-2 px-2 py-1 text-xs border rounded"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Upload Section */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Project PDFs</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload PDFs
                      </label>
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handlePDFUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload project reports, documentation, etc.</p>
                    </div>

                    {/* PDF Previews */}
                    {uploadedPDFs.length > 0 && (
                      <div className="space-y-3">
                        {uploadedPDFs.map((pdf, index) => (
                          <div key={index} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                    <span className="text-red-600 font-bold text-sm">PDF</span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {pdf.file ? pdf.file.name : pdf.title}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    placeholder="PDF Title..."
                                    value={pdf.title}
                                    onChange={(e) => updatePDFDetails(index, 'title', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border rounded"
                                  />
                                  <input
                                    type="text"
                                    placeholder="PDF Description..."
                                    value={pdf.description}
                                    onChange={(e) => updatePDFDetails(index, 'description', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border rounded"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={() => removePDF(index)}
                                className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured project
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProject}
                  disabled={!formData.title || !formData.summary || !formData.category || isUploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isCreating ? 'Create Project' : 'Save Changes'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
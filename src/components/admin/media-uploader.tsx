'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Project, ProjectImage, ProjectPDF } from '@/types';
import { Upload, ArrowLeft, ArrowRight, Trash2, Download, Eye } from 'lucide-react';

interface MediaUploaderProps {
  project: Project;
  onClose: () => void;
  onUpdate: () => void;
}

export default function MediaUploader({ project, onClose, onUpdate }: MediaUploaderProps) {
  const [images, setImages] = useState<ProjectImage[]>(project.images || []);
  const [pdfs, setPdfs] = useState<ProjectPDF[]>(project.pdfs || []);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = async (file: File, type: 'image' | 'pdf') => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('projectSlug', project.slug);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        if (type === 'image') {
          const newImage: ProjectImage = {
            src: data.file.path,
            caption: '',
          };
          setImages(prev => [...prev, newImage]);
        } else {
          const newPdf: ProjectPDF = {
            src: data.file.path,
            title: data.file.name,
            description: '',
          };
          setPdfs(prev => [...prev, newPdf]);
        }

        toast({
          title: 'Success',
          description: 'File uploaded successfully',
        });
      } else {
        const errorData = await response.json();
        toast({
          title: 'Upload failed',
          description: errorData.message || 'Failed to upload file',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during upload',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageCaptionChange = (index: number, caption: string) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, caption } : img
    ));
  };

  const handlePdfTitleChange = (index: number, title: string) => {
    setPdfs(prev => prev.map((pdf, i) => 
      i === index ? { ...pdf, title } : pdf
    ));
  };

  const handlePdfDescriptionChange = (index: number, description: string) => {
    setPdfs(prev => prev.map((pdf, i) => 
      i === index ? { ...pdf, description } : pdf
    ));
  };

  const handleDeleteImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (selectedImageIndex >= images.length - 1) {
      setSelectedImageIndex(Math.max(0, images.length - 2));
    }
  };

  const handleDeletePdf = (index: number) => {
    setPdfs(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };

  const saveMedia = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${project.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          images,
          pdfs,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Media saved successfully',
        });
        onUpdate();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save media',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving media:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving media',
        variant: 'destructive',
      });
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="images">Images ({images.length})</TabsTrigger>
          <TabsTrigger value="pdfs">PDFs ({pdfs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Project Images</h3>
            <div className="flex space-x-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'image');
                }}
                disabled={isUploading}
                className="hidden"
                id="image-upload"
              />
              <Label htmlFor="image-upload">
                <Button asChild variant="outline" disabled={isUploading}>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </span>
                </Button>
              </Label>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                  <img
                    src={images[selectedImageIndex]?.src}
                    alt={`Project image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={prevImage}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={nextImage}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-600 text-center">
                  Image {selectedImageIndex + 1} of {images.length}
                </div>
              </div>

              {/* Image List */}
              <div className="space-y-4">
                <h4 className="font-medium">All Images</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {images.map((image, index) => (
                    <Card key={index} className={`p-3 ${selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className="flex space-x-3">
                        <img
                          src={image.src}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                          onClick={() => setSelectedImageIndex(index)}
                        />
                        <div className="flex-1 space-y-2">
                          <Textarea
                            placeholder="Image caption..."
                            value={image.caption || ''}
                            onChange={(e) => handleImageCaptionChange(index, e.target.value)}
                            rows={2}
                            className="text-sm"
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedImageIndex(index)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveImage(index, Math.max(0, index - 1))}
                              disabled={index === 0}
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))}
                              disabled={index === images.length - 1}
                            >
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteImage(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {images.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
                <p className="text-gray-600 text-center mb-4">
                  Upload images to showcase your project
                </p>
                <Label htmlFor="image-upload">
                  <Button asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload First Image
                    </span>
                  </Button>
                </Label>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pdfs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Project PDFs</h3>
            <div className="flex space-x-2">
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'pdf');
                }}
                disabled={isUploading}
                className="hidden"
                id="pdf-upload"
              />
              <Label htmlFor="pdf-upload">
                <Button asChild variant="outline" disabled={isUploading}>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF
                  </span>
                </Button>
              </Label>
            </div>
          </div>

          {pdfs.length > 0 ? (
            <div className="space-y-4">
              {pdfs.map((pdf, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-16 bg-red-100 rounded flex items-center justify-center">
                        <span className="text-red-600 font-bold text-sm">PDF</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <Input
                          placeholder="PDF title..."
                          value={pdf.title}
                          onChange={(e) => handlePdfTitleChange(index, e.target.value)}
                        />
                      </div>
                      <div>
                        <Textarea
                          placeholder="PDF description..."
                          value={pdf.description || ''}
                          onChange={(e) => handlePdfDescriptionChange(index, e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(pdf.src, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = pdf.src;
                            link.download = pdf.title;
                            link.click();
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePdf(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No PDFs yet</h3>
                <p className="text-gray-600 text-center mb-4">
                  Upload PDF documents related to your project
                </p>
                <Label htmlFor="pdf-upload">
                  <Button asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload First PDF
                    </span>
                  </Button>
                </Label>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={saveMedia}>
          Save Media
        </Button>
      </div>
    </div>
  );
}

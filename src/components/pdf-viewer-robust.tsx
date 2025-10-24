'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, FileText, Eye } from 'lucide-react';

interface PDFViewerProps {
  src: string;
  title: string;
  description?: string;
}

export function PDFViewerRobust({ src, title, description }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    // Set a timeout to show the viewer options after 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const openInNewTab = () => {
    // Ensure we have a full URL
    const fullUrl = src.startsWith('http') ? src : `${window.location.origin}${src}`;
    window.open(fullUrl, '_blank');
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    const fullUrl = src.startsWith('http') ? src : `${window.location.origin}${src}`;
    link.href = fullUrl;
    link.download = title;
    link.click();
  };

  const tryViewer = () => {
    setShowViewer(true);
    setIsLoading(true);
    
    // Try to load the PDF in an iframe
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  if (isLoading && !showViewer) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-sm text-gray-600 mb-4">Loading PDF...</p>
        <Button
          onClick={tryViewer}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Eye className="h-4 w-4 mr-2" />
          Try Inline Viewer
        </Button>
      </div>
    );
  }

  if (showViewer && isLoading) {
    const fullUrl = src.startsWith('http') ? src : `${window.location.origin}${src}`;
    return (
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading PDF...</p>
          </div>
        </div>
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`}
          width="100%"
          height="384"
          className="border-0 rounded-lg"
          title={title}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            console.log('Google viewer failed, trying direct iframe...');
            setIsLoading(false);
          }}
        />
      </div>
    );
  }

  if (showViewer && !isLoading) {
    const fullUrl = src.startsWith('http') ? src : `${window.location.origin}${src}`;
    return (
      <div className="w-full h-96 rounded-lg overflow-hidden border bg-gray-50">
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`}
          width="100%"
          height="100%"
          className="border-0"
          title={title}
        />
      </div>
    );
  }

  // Default fallback - show options
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-gray-50 rounded-lg">
      <div className="text-blue-500 mb-4">
        <FileText className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Ready to View</h3>
      <p className="text-gray-600 mb-6">
        Choose how you'd like to view the PDF document
      </p>
      <div className="space-x-3">
        <Button
          onClick={tryViewer}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Inline
        </Button>
        <Button
          onClick={openInNewTab}
          variant="outline"
          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in New Tab
        </Button>
        <Button
          onClick={downloadPDF}
          variant="outline"
          className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}

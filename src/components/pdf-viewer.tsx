'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Dynamically import PDF viewer to avoid SSR issues
const PDFViewerComponent = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);

const PDFPage = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

interface PDFViewerProps {
  src: string;
  title: string;
  description?: string;
  visible?: boolean;
}

export function PDFViewer({ src, title, description, visible = false }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Reset state when component becomes visible
    if (visible) {
      setLoading(true);
      setError(null);
      setNumPages(null);
      setPageNumber(1);
    }
  }, [visible]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setError('Failed to load PDF document');
    setLoading(false);
    console.error('PDF load error:', error);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* PDF Controls */}
      {numPages && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Badge variant="secondary">
            {numPages} page{numPages !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      {/* PDF Viewer */}
      <div className="relative max-h-[600px] w-full overflow-y-auto rounded-lg border bg-gray-50 dark:bg-gray-900">
        {loading && (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <div className="text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Unable to load PDF</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(src, '_blank')}
              >
                Open in New Tab
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && visible && (
          <div className="flex justify-center p-4">
            <PDFViewerComponent
              file={src}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex h-full min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Loading PDF...</p>
                  </div>
                </div>
              }
            >
              <PDFPage
                pageNumber={pageNumber}
                width={800}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </PDFViewerComponent>
          </div>
        )}
      </div>
    </div>
  );
}

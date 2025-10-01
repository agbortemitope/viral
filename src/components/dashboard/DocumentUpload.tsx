import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/hooks/useDocuments";
import { Upload, FileText, Download, Trash2, Star, StarOff, Loader as Loader2, File, Image as ImageIcon } from "lucide-react";

const DocumentUpload = () => {
  const { documents, loading, uploading, uploadDocument, deleteDocument, setPrimaryDocument } = useDocuments();
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    { value: 'cv', label: 'CV', description: 'Curriculum Vitae' },
    { value: 'resume', label: 'Resume', description: 'Professional Resume' },
    { value: 'portfolio', label: 'Portfolio', description: 'Work Portfolio' },
    { value: 'certificate', label: 'Certificate', description: 'Certifications & Awards' },
  ] as const;

  const handleFileUpload = async (files: FileList | null, documentType: 'cv' | 'resume' | 'portfolio' | 'certificate') => {
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadDocument(file, documentType);
  };

  const handleDrop = (e: React.DragEvent, documentType: 'cv' | 'resume' | 'portfolio' | 'certificate') => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files, documentType);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (mimeType.includes('word')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (mimeType.includes('image')) return <ImageIcon className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Management
          </CardTitle>
          <CardDescription>
            Upload and manage your CV, resume, portfolio, and certificates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentTypes.map((docType) => {
              const userDocs = documents.filter(d => d.document_type === docType.value);
              const primaryDoc = userDocs.find(d => d.is_primary);

              return (
                <div key={docType.value} className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{docType.label}</h3>
                    <p className="text-sm text-muted-foreground">{docType.description}</p>
                  </div>

                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => handleDrop(e, docType.value)}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e.target.files, docType.value)}
                    />
                    
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop or click to upload
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Choose File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PDF, DOC, DOCX, JPG, PNG (max 10MB)
                    </p>
                  </div>

                  {/* Uploaded Documents */}
                  {userDocs.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Uploaded Files:</h4>
                      {userDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.mime_type)}
                            <div>
                              <p className="text-sm font-medium text-foreground">{doc.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {doc.is_primary && (
                              <Badge variant="default" className="ml-2">Primary</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPrimaryDocument(doc.id, doc.document_type)}
                              disabled={doc.is_primary}
                            >
                              {doc.is_primary ? (
                                <Star className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(doc.file_url, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
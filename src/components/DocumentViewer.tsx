import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PDFViewer } from "./PDFViewer";
import { ImageViewer } from "./ImageViewer";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType?: "pdf" | "image";
}

export const DocumentViewer = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType = "pdf",
}: DocumentViewerProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>{fileName}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {fileType === "pdf" ? (
            <PDFViewer fileUrl={fileUrl} />
          ) : (
            <ImageViewer fileUrl={fileUrl} fileName={fileName} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

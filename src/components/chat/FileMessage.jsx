import { FileText, Download, Image, File } from 'lucide-react';

const getFileIcon = (fileName) => {
  const ext = fileName?.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return Image;
  return File;
};

export default function FileMessage({ fileUrl, fileName, fileSize }) {
  const FileIcon = getFileIcon(fileName);

  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated cursor-pointer hover:bg-bg-base transition-colors"
      onClick={handleDownload}
    >
      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
        <FileIcon className="w-5 h-5 text-primary-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{fileName}</p>
        <p className="text-xs text-text-muted">
          {fileSize && `${(fileSize / 1024 / 1024).toFixed(2)} MB`}
        </p>
      </div>
      <Download className="w-4 h-4 text-text-secondary" />
    </div>
  );
}
import React from 'react';
import { File, Download } from 'lucide-react';

interface FileAttachmentProps {
  name: string;
  size?: number | null;
  url: string;
}

export const FileAttachment: React.FC<FileAttachmentProps> = ({ name, size, url }) => {
  const formatBytes = (bytes?: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 max-w-sm w-full gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 flex-shrink-0">
          <File className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate" title={name}>
            {name}
          </p>
          <p className="text-xs text-zinc-500">{formatBytes(size)}</p>
        </div>
      </div>

      <a
        href={url}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 flex items-center justify-center text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200 transition-colors flex-shrink-0"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
};
export default FileAttachment;

'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaType?: 'IMAGE' | 'VIDEO' | string;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  isOpen,
  onClose,
  mediaUrl,
  mediaType = 'IMAGE',
}) => {
  if (!isOpen || !mediaUrl) return null;

  const isVideo = mediaType === 'VIDEO' || mediaUrl.match(/\.(mp4|webm|ogg)$/i);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-5xl max-h-[90vh] w-full h-full p-4 flex items-center justify-center"
        >
          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={mediaUrl}
                alt="Fullscreen Preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default MediaViewer;

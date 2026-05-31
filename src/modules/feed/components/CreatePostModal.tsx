'use client';

import React, { useState, useRef } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/shared/Avatar';
import { useAuthStore } from '../../../store/auth.store';
import { useFeed } from '../hooks/useFeed';
import { usePost } from '../../posts/hooks/usePost';
import { Image as ImageIcon, Globe, Users, Lock, X, Loader2 } from 'lucide-react';
import toast from '../../../components/ui/Toast';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { createPost } = useFeed();
  const { uploadFile, isUploading, uploadProgress } = usePost();
  
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const res = await uploadFile(file);
      setMediaUrls((prev) => [...prev, res.mediaUrl]);
      toast.success('Image uploaded successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    }
  };

  const handleRemoveImage = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) {
      toast.warning('Post content cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost({
        content: content.trim(),
        mediaUrls,
        visibility,
      });
      setContent('');
      setMediaUrls([]);
      toast.success('Post created successfully!');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibilityOptions = [
    { value: 'PUBLIC', label: 'Public', icon: Globe },
    { value: 'FRIENDS', label: 'Friends Only', icon: Users },
    { value: 'PRIVATE', label: 'Only Me', icon: Lock },
  ];

  const activeOption = visibilityOptions.find((o) => o.value === visibility) || visibilityOptions[0];
  const VisibilityIcon = activeOption.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Post" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Mini Header */}
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar} name={user?.name || 'U'} size="md" />
          <div className="flex flex-col items-start gap-1">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{user?.name}</p>
            {/* Visibility Selector */}
            <div className="relative inline-block text-left">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="appearance-none bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-300 pl-7 pr-6 py-1 focus:outline-none cursor-pointer flex items-center gap-1"
              >
                <option value="PUBLIC">Public</option>
                <option value="FRIENDS">Friends</option>
                <option value="PRIVATE">Only Me</option>
              </select>
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                <VisibilityIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Text Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What's on your mind, ${user?.name?.split(' ')[0] || 'there'}?`}
          rows={4}
          className="w-full text-sm bg-transparent border-0 resize-none text-zinc-850 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 focus:outline-none pr-2"
        />

        {/* Image Previews */}
        {mediaUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {mediaUrls.map((url, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group border border-zinc-200/10">
                <img src={url} alt="Upload preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="space-y-1.5 p-3 rounded-xl border border-violet-100 dark:border-violet-950/20 bg-violet-500/5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Uploading image...</span>
              <span className="text-violet-500 font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-500 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Panel */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/30">
          <span className="text-xs font-bold text-zinc-500">Add to your post</span>
          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={handleImageUploadClick}
              disabled={isUploading}
              className="p-2 text-green-500 hover:bg-green-500/10 dark:hover:bg-green-500/20 rounded-lg transition-all cursor-pointer flex items-center justify-center"
              title="Add Image"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ImageIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full py-3"
          disabled={!content.trim() && mediaUrls.length === 0}
        >
          Post
        </Button>
      </form>
    </Modal>
  );
};
export default CreatePostModal;

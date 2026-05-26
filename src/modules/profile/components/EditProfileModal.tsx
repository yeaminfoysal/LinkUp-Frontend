'use client';

import React, { useState, useRef } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/shared/Avatar';
import usePost from '../../posts/hooks/usePost';
import { Camera, Loader2 } from 'lucide-react';
import toast from '../../../components/ui/Toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSave: (data: { name: string; bio: string; avatar: string }) => Promise<any>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatar, setAvatar] = useState(profile?.avatar || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = usePost();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const res = await uploadFile(file);
      setAvatar(res.mediaUrl);
      toast.success('Profile picture uploaded successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload profile picture');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        name: name.trim(),
        bio: bio.trim(),
        avatar,
      });
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar Upload Container */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <Avatar
              src={avatar}
              name={name || 'U'}
              size="xl"
              className="border-4 border-violet-500/25 group-hover:brightness-75 transition-all shadow-md"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Camera className="w-6 h-6" />
              )}
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <span className="text-xs text-zinc-500 font-semibold">Click avatar to upload photo</span>
        </div>

        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/25 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-sm"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Bio text area */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={160}
            className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/25 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
            placeholder="Tell us about yourself..."
          />
          <div className="text-[10px] text-right text-zinc-400 font-medium">
            {bio.length}/160 characters
          </div>
        </div>

        {/* Save button */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full py-3"
          disabled={isUploading}
        >
          Save Changes
        </Button>
      </form>
    </Modal>
  );
};
export default EditProfileModal;

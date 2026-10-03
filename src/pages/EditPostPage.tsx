import React, { useState, useEffect } from 'react';
import { LostFoundPost } from '../oop/LostFoundPost';
import { User } from '../oop/User';
import {
  UploadCloud,
  MapPin,
  Calendar,
  Clock,
  Phone,
  AlertCircle,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';

interface EditPostPageProps {
  post: LostFoundPost;
  currentUser: User | null;
  onPostUpdated: (postID: string) => void;
  onCancel: () => void;
  onUpdatePostService: (
    postID: string,
    updates: {
      itemName: string;
      image: string;
      location: string;
      incidentDate: string;
      approximateTime: string;
      contactNumber: string;
      details: string;
    }
  ) => void;
}

export const EditPostPage: React.FC<EditPostPageProps> = ({
  post,
  currentUser,
  onPostUpdated,
  onCancel,
  onUpdatePostService,
}) => {
  // Validate ownership before rendering
  const isOwner = currentUser?.userID === post.ownerID;
  const isAdmin = currentUser?.role === 'ADMIN';
  const isAuthorized = isOwner || isAdmin;

  const [itemName, setItemName] = useState(post.itemName);
  const [location, setLocation] = useState(post.location);
  const [incidentDate, setIncidentDate] = useState(post.incidentDate || '');
  const [approximateTime, setApproximateTime] = useState(post.approximateTime || '');
  const [contactNumber, setContactNumber] = useState(post.contactNumber || '');
  const [details, setDetails] = useState(post.details || '');
  const [imageUrl, setImageUrl] = useState(post.image || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-red-200 rounded-2xl shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-[#A82024] flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
        <p className="text-xs text-slate-600 mt-2">
          You are not authorized to edit this post. Only the original author or system administrator can modify this item.
        </p>
        <button
          onClick={onCancel}
          className="mt-6 px-4 py-2 bg-[#16325C] text-white text-xs font-semibold rounded-lg"
        >
          Return to Post
        </button>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Invalid image format. Supported formats: JPG, JPEG, PNG, WEBP.');
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setErrorMessage('Image must be smaller than 5 MB.');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!itemName.trim()) {
      setErrorMessage('Please enter an item name.');
      return;
    }

    if (!location.trim()) {
      setErrorMessage('Please provide the location.');
      return;
    }

    setIsSubmitting(true);
    try {
      onUpdatePostService(post.postID, {
        itemName,
        image: imageUrl,
        location,
        incidentDate,
        approximateTime,
        contactNumber,
        details,
      });

      onPostUpdated(post.postID);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#16325C] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Cancel Editing
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Post ID: {post.postID} • Type: {post.type}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-brand-title mt-1">
            Edit Post: {post.itemName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ownership and creation timestamp remain permanently preserved.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-[#A82024]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Image
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-32 h-24 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                <img src={imageUrl} alt="Item" className="w-full h-full object-cover" />
              </div>
              <label className="flex-1 flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 hover:border-[#16325C] rounded-xl cursor-pointer bg-slate-50 text-center">
                <UploadCloud className="w-5 h-5 text-slate-500 mb-1" />
                <span className="text-xs font-semibold text-slate-700">Change Picture</span>
                <span className="text-[10px] text-slate-500">JPG, PNG, WEBP (&lt;5MB)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date of Incident
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Approximate Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={approximateTime}
                  onChange={(e) => setApproximateTime(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Details
            </label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#16325C] hover:bg-[#0F2341] rounded-xl shadow-xs transition-colors"
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { User } from '../oop/User';
import { PostType } from '../oop/types';
import {
  UploadCloud,
  MapPin,
  Calendar,
  Clock,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface CreatePostPageProps {
  currentUser: User | null;
  onPostCreated: (postID: string) => void;
  onOpenAuth: () => void;
  onCancel: () => void;
  onCreatePostService: (data: {
    type: PostType;
    itemName: string;
    image: string;
    location: string;
    incidentDate: string;
    approximateTime: string;
    contactNumber: string;
    details: string;
  }) => string; // returns created post ID
}

// Sample realistic images for quick demo selection
const DEMO_PRESET_IMAGES = [
  { label: 'Leather Wallet', url: '/images/item_black_wallet_1791045765571.jpg' },
  { label: 'Wireless Earbuds', url: '/images/item_earphones_case_1791045776703.jpg' },
  { label: 'Dorm Keys & Lanyard', url: '/images/item_keys_lanyard_1791045788072.jpg' },
  { label: 'Casio Watch', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Blue Notebook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Graph Calculator', url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&auto=format&fit=crop&q=80' },
];

const COMMON_CAMPUS_LOCATIONS = [
  'Main Library, 2nd Floor Reading Hall',
  'Central Cafeteria, Table Area',
  'Computer Science Wing, Lab B',
  'Sports Complex Gymnasium',
  'Hostel Block 4 Walkway',
  'Auditorium Lecture Hall 1',
];

export const CreatePostPage: React.FC<CreatePostPageProps> = ({
  currentUser,
  onPostCreated,
  onOpenAuth,
  onCancel,
  onCreatePostService,
}) => {
  const [postType, setPostType] = useState<PostType>('LOST');
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [approximateTime, setApproximateTime] = useState('10:00 AM');
  const [contactNumber, setContactNumber] = useState(currentUser?.phone || '');
  const [details, setDetails] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload validation (JPG, JPEG, PNG, WEBP, <5MB)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Invalid image format. Supported formats: JPG, JPEG, PNG, WEBP.');
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
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

    if (!currentUser) {
      setErrorMessage('Please login with your university account to publish a report.');
      onOpenAuth();
      return;
    }

    if (!postType) {
      setErrorMessage('Please select Lost or Found.');
      return;
    }

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
      const newPostId = onCreatePostService({
        type: postType,
        itemName,
        image: imageUrl,
        location,
        incidentDate,
        approximateTime,
        contactNumber: contactNumber || currentUser.phone,
        details,
      });

      onPostCreated(newPostId);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 font-brand-title">
          Report Lost / Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
          Submit official report into the iTECH database. System automatically timestamps your submission.
        </p>
      </div>

      {/* Guest Notice if Not Authenticated */}
      {!currentUser && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>You need to be signed in as an iTECH student or staff to post a listing.</span>
          </div>
          <button
            type="button"
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 bg-[#16325C] text-white font-bold rounded-lg text-xs hover:bg-[#0F2341] shrink-0"
          >
            Sign In Now
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-[#A82024]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Two Large Options (Rule 11) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              1. What would you like to report? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: I LOST SOMETHING */}
              <button
                type="button"
                onClick={() => {
                  setPostType('LOST');
                  if (!imageUrl || imageUrl.includes('photo-1582139329536')) {
                    setImageUrl('https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80');
                  }
                }}
                className={`p-5 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  postType === 'LOST'
                    ? 'border-[#A82024] bg-red-50/70 text-[#A82024] shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    postType === 'LOST' ? 'bg-[#A82024] text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  !
                </div>
                <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
                  I LOST SOMETHING
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  You misplaced an item and are seeking recovery
                </span>
              </button>

              {/* Option B: I FOUND SOMETHING */}
              <button
                type="button"
                onClick={() => {
                  setPostType('FOUND');
                  if (!imageUrl || imageUrl.includes('photo-1627123424574')) {
                    setImageUrl('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80');
                  }
                }}
                className={`p-5 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  postType === 'FOUND'
                    ? 'border-[#16325C] bg-blue-50/70 text-[#16325C] shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    postType === 'FOUND' ? 'bg-[#16325C] text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  ✓
                </div>
                <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
                  I FOUND SOMETHING
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  You found someone's item on campus grounds
                </span>
              </button>
            </div>
          </div>

          {/* STEP 2: Item Name (Required) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Black Wallet, Casio Watch, Blue Notebook..."
              className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C] focus:border-[#16325C]"
            />
          </div>

          {/* STEP 3: Item Picture (Upload & Demo Presets) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Picture (Supported: JPG, JPEG, PNG, WEBP &lt; 5MB)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Image Preview Box */}
              <div className="relative aspect-video sm:aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                {imageUrl ? (
                  <img src={imageUrl} alt="Item Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-3 text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-[10px]">No image selected</span>
                  </div>
                )}
              </div>

              {/* Upload Input & Presets */}
              <div className="sm:col-span-2 space-y-3">
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-[#16325C] rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-500 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Upload from Device</span>
                  <span className="text-[10px] text-slate-500">JPG, PNG, WEBP (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Sample Presets for quick evaluation */}
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Or select sample item photo:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {DEMO_PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={`text-[10px] p-1.5 rounded border text-left truncate transition-colors ${
                          imageUrl === preset.url
                            ? 'bg-blue-50 border-[#16325C] text-[#16325C] font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: Location (Required) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Location *
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Click a campus chip below to auto-fill</span>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where was it lost/found? e.g. Main Library 2nd Floor, Cafeteria Table 4..."
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C] focus:border-[#16325C]"
              />
            </div>

            {/* Quick Campus Location Chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {COMMON_CAMPUS_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${
                    location === loc
                      ? 'bg-blue-50 border-[#16325C] text-[#16325C] font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {loc.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 5: Incident Date & Approximate Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date Lost / Found
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
                  placeholder="e.g. 02:30 PM, Morning lecture..."
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
                />
              </div>
            </div>
          </div>

          {/* STEP 6: Contact Number */}
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
                placeholder="+92 300 0000000"
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
              />
            </div>
          </div>

          {/* STEP 7: Details (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Additional Details (Optional)
            </label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Black leather wallet. It may contain my university card and metro pass..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
            />
          </div>

          {/* Automatic Post Date & Time Notice (Rule 12) */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Automatic Timestamp:</strong> System automatically records and stamps the exact submission date &amp; time upon posting.
            </span>
          </div>

          {/* Form Actions */}
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
              className={`px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs transition-colors ${
                postType === 'LOST'
                  ? 'bg-[#A82024] hover:bg-[#88171B]'
                  : 'bg-[#16325C] hover:bg-[#0F2341]'
              }`}
            >
              {isSubmitting ? 'Publishing Report...' : `Publish ${postType === 'LOST' ? 'Lost' : 'Found'} Post`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

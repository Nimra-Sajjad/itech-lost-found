import React, { useState } from 'react';
import { LostFoundPost } from '../oop/LostFoundPost';
import { User } from '../oop/User';
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  User as UserIcon,
  Flag,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Share2,
  ArrowLeft,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

interface PostDetailPageProps {
  post: LostFoundPost;
  currentUser: User | null;
  onNavigateBack: () => void;
  onEdit: (postID: string) => void;
  onDeleteRequest: (postID: string) => void;
  onMarkResolvedRequest: (postID: string) => void;
  onOpenReportModal: (postID: string, postTitle: string) => void;
  onOpenAuth: () => void;
}

export const PostDetailPage: React.FC<PostDetailPageProps> = ({
  post,
  currentUser,
  onNavigateBack,
  onEdit,
  onDeleteRequest,
  onMarkResolvedRequest,
  onOpenReportModal,
  onOpenAuth,
}) => {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const isOwner = currentUser?.userID === post.ownerID;
  const isAdmin = currentUser?.role === 'ADMIN';
  const canModify = isOwner || isAdmin;
  const isLost = post.type === 'LOST';
  const isResolved = post.isResolved();

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#post=${encodeURIComponent(post.postID)}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back Button */}
      <button
        onClick={onNavigateBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#16325C] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </button>

      {/* Main Post Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        {/* Top Media & Badges */}
        <div className="relative aspect-16/9 w-full bg-slate-100 max-h-[440px] overflow-hidden">
          <img
            src={post.image}
            alt={post.itemName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80';
            }}
          />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`text-xs font-extrabold uppercase px-3 py-1.5 rounded-lg shadow-md tracking-wider text-white ${
                isLost ? 'bg-[#A82024]' : 'bg-[#16325C]'
              }`}
            >
              {isLost ? 'LOST ITEM' : 'FOUND ITEM'}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            {isResolved ? (
              <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                RESOLVED
              </span>
            ) : (
              <span className="bg-slate-900/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-brand-title">
                {post.itemName}
              </h1>

              <button
                onClick={handleShare}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copySuccess ? 'Link Copied!' : 'Share Post'}
              </button>
            </div>

            {/* Timestamp Notice (Rule 12) */}
            <div className="text-xs text-slate-400 font-medium mt-1">
              Posted on: <span className="text-slate-600 font-semibold">{post.postedAt}</span>
            </div>
          </div>

          {/* Key Incident Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#A82024] shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Incident Location
                </span>
                <span className="text-slate-900 font-medium">{post.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#16325C] shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Date of Incident
                </span>
                <span className="text-slate-900 font-medium">{post.incidentDate || 'Not specified'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Approximate Time
                </span>
                <span className="text-slate-900 font-medium">{post.approximateTime || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Item Description &amp; Identifying Details
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
              {post.details ? post.details : <span className="italic text-slate-400">No additional details provided.</span>}
            </div>
          </div>

          {/* Reporter & Contact Information Strip */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#16325C] text-white flex items-center justify-center font-bold text-sm">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  {post.ownerName}
                </span>
                <span className="text-[11px] text-slate-500">
                  iTECH Community Member • Verified University Post
                </span>
              </div>
            </div>

            {/* Contact Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => (currentUser ? setShowContactDialog(true) : onOpenAuth())}
                className="px-5 py-2.5 bg-[#16325C] hover:bg-[#0F2341] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                {currentUser ? 'Contact Student' : 'Login to Contact'}
              </button>

              <button
                onClick={() => onOpenReportModal(post.postID, post.itemName)}
                className="px-3.5 py-2.5 bg-white hover:bg-red-50 text-[#A82024] border border-red-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                title="Report inappropriate post"
              >
                <Flag className="w-3.5 h-3.5" />
                Report Post
              </button>
            </div>
          </div>

          {/* Contact Details Popup Dialog */}
          {showContactDialog && currentUser && (
            <div className="p-5 bg-white rounded-xl border-2 border-[#16325C] shadow-lg animate-in fade-in duration-150">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#16325C]" />
                  <h4 className="text-sm font-bold text-slate-900">Direct Contact Information</h4>
                </div>
                <button
                  onClick={() => setShowContactDialog(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Close
                </button>
              </div>

              <div className="mt-3 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500">Phone / WhatsApp:</span>
                  <a
                    href={`tel:${post.contactNumber}`}
                    className="font-bold text-[#16325C] hover:underline"
                  >
                    {post.contactNumber || 'Contact through university email'}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500">University Email:</span>
                  <a
                    href={`mailto:${post.ownerEmail}`}
                    className="font-bold text-[#16325C] hover:underline"
                  >
                    {post.ownerEmail}
                  </a>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
                  <strong>Campus Safety Advice:</strong> Arrange handovers in well-lit public campus areas such as the Main Library Information Desk or Campus Security Office.
                </div>
              </div>
            </div>
          )}

          {/* Action Bar for Owner / Administrator (Rule 18) */}
          {canModify && (
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Post Management (Owner / Administrator Clearance)
                </span>
                {isAdmin && (
                  <span className="text-[10px] bg-red-100 text-[#A82024] font-bold px-2 py-0.5 rounded">
                    Admin Privilege
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {!isResolved && (
                  <button
                    onClick={() => onMarkResolvedRequest(post.postID)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Resolved
                  </button>
                )}

                <button
                  onClick={() => onEdit(post.postID)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Post
                </button>

                <button
                  onClick={() => onDeleteRequest(post.postID)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#A82024] text-xs font-semibold rounded-xl border border-red-200 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

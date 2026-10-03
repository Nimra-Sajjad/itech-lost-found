import React, { useState } from 'react';
import { LostFoundPost } from '../oop/LostFoundPost';
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Share2,
  Check,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ItemCardProps {
  post: LostFoundPost;
  onViewDetails: (postID: string) => void;
  onEdit?: (postID: string) => void;
  onDelete?: (postID: string) => void;
  onMarkResolved?: (postID: string) => void;
  isOwner?: boolean;
  isAdmin?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  post,
  onViewDetails,
  onEdit,
  onDelete,
  onMarkResolved,
  isOwner = false,
  isAdmin = false,
}) => {
  const [copied, setCopied] = useState(false);
  const isLost = post.type === 'LOST';
  const isResolved = post.isResolved();

  const handleQuickShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#post=${encodeURIComponent(post.postID)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onViewDetails(post.postID)}
      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div>
        {/* Image with Badges */}
        <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
          <img
            src={post.image}
            alt={post.itemName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80';
            }}
          />

          {/* Type Badge: LOST (Crimson) or FOUND (Navy) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`font-bold tracking-wider text-xs px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 text-white uppercase ${
                isLost ? 'bg-[#A82024]' : 'bg-[#16325C]'
              }`}
            >
              {isLost ? 'LOST' : 'FOUND'}
            </span>
          </div>

          {/* Status Badge & Share Button */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={handleQuickShare}
              title="Copy share link"
              className="p-1.5 bg-black/50 hover:bg-black/80 backdrop-blur-xs text-white rounded-lg transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {isResolved ? (
              <span className="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                RESOLVED
              </span>
            ) : (
              <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Item Name */}
          <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-[#16325C] transition-colors line-clamp-1">
            {post.itemName}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-600 text-xs mt-2">
            <MapPin className="w-3.5 h-3.5 text-[#A82024] shrink-0" />
            <span className="line-clamp-1 font-medium">
              {isLost ? `Lost near ${post.location}` : `Found near ${post.location}`}
            </span>
          </div>

          {/* Incident Date & Approximate Time */}
          <div className="flex flex-wrap items-center gap-2 text-slate-500 text-[11px] mt-1.5">
            {post.incidentDate && (
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3 h-3 text-slate-400" />
                {post.incidentDate}
              </span>
            )}
            {post.approximateTime && post.approximateTime !== 'Not specified' && (
              <>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {post.approximateTime}
                </span>
              </>
            )}
          </div>

          {/* Short description quote */}
          {post.details && (
            <p className="text-slate-600 text-xs mt-3 line-clamp-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              "{post.details}"
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Timestamp & Interactive Actions */}
      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 flex flex-col gap-2.5 bg-slate-50/50">
        <div className="text-[11px] text-slate-400 font-medium">
          Posted: {post.postedAt}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(post.postID);
            }}
            className="flex-1 bg-[#16325C] hover:bg-[#0F2341] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5 group/btn"
          >
            <span>{isLost ? 'Found this? Contact' : 'Is this yours? View'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </button>

          {/* Quick Actions for Owner / Admin */}
          {(isOwner || isAdmin) && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1"
            >
              {!isResolved && onMarkResolved && (
                <button
                  onClick={() => onMarkResolved(post.postID)}
                  title="Mark as Resolved"
                  className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-medium transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(post.postID)}
                  title="Edit Post"
                  className="py-2 px-2.5 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(post.postID)}
                  title="Delete Post"
                  className="p-2 text-[#A82024] bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-medium transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

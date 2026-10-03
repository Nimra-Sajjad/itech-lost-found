import React, { useState } from 'react';
import { LostFoundPost } from '../oop/LostFoundPost';
import { User } from '../oop/User';
import {
  PlusCircle,
  FolderOpen,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

interface MyPostsPageProps {
  currentUser: User | null;
  posts: LostFoundPost[];
  onNavigate: (view: string) => void;
  onViewDetails: (postID: string) => void;
  onEdit: (postID: string) => void;
  onDeleteRequest: (postID: string) => void;
  onMarkResolvedRequest: (postID: string) => void;
  onOpenAuth: () => void;
}

export const MyPostsPage: React.FC<MyPostsPageProps> = ({
  currentUser,
  posts,
  onNavigate,
  onViewDetails,
  onEdit,
  onDeleteRequest,
  onMarkResolvedRequest,
  onOpenAuth,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
        <FolderOpen className="w-12 h-12 text-[#16325C] mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Sign In Required</h2>
        <p className="text-xs text-slate-600 mt-2">
          Please login to view and manage your university lost &amp; found listings.
        </p>
        <button
          onClick={onOpenAuth}
          className="mt-6 px-5 py-2.5 bg-[#16325C] text-white text-xs font-bold rounded-xl"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Filter ONLY posts owned by the current student (Rule 15)
  const myPosts = posts.filter((p) => p.ownerID === currentUser.userID);

  const filteredMyPosts = myPosts.filter((p) => {
    if (filter === 'ACTIVE' && p.isResolved()) return false;
    if (filter === 'RESOLVED' && !p.isResolved()) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#16325C] text-white text-xs font-bold uppercase px-2.5 py-1 rounded-md">
              Student Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-brand-title">
              My Posts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage, edit, resolve, or remove your personal Lost &amp; Found listings.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create-post')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A82024] hover:bg-[#88171B] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Listing
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === 'ALL'
                ? 'bg-[#16325C] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Listings ({myPosts.length})
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === 'ACTIVE'
                ? 'bg-[#A82024] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Active ({myPosts.filter((p) => !p.isResolved()).length})
          </button>
          <button
            onClick={() => setFilter('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === 'RESOLVED'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Resolved ({myPosts.filter((p) => p.isResolved()).length})
          </button>
        </div>
      </div>

      {/* Post Cards Grid */}
      <div className="mt-8">
        {filteredMyPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMyPosts.map((post) => {
              const isLost = post.type === 'LOST';
              const isResolved = post.isResolved();

              return (
                <div
                  key={post.postID}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Media */}
                    <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.itemName}
                        className="w-full h-full object-cover"
                      />

                      {/* Type Badge */}
                      <span
                        className={`absolute top-3 left-3 text-[11px] font-bold uppercase px-2.5 py-1 rounded-md text-white shadow-xs ${
                          isLost ? 'bg-[#A82024]' : 'bg-[#16325C]'
                        }`}
                      >
                        {post.type}
                      </span>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {isResolved ? (
                          <span className="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            RESOLVED
                          </span>
                        ) : (
                          <span className="bg-slate-900/80 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Information */}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                        {post.itemName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#A82024] shrink-0" />
                        <span className="truncate">{post.location}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-2">
                        Posted: {post.postedAt}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar matching Rule 15: [View] [Edit] [Delete] [Mark Resolved] */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onViewDetails(post.postID)}
                      className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>

                    <button
                      onClick={() => onEdit(post.postID)}
                      className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    {!isResolved && (
                      <button
                        onClick={() => onMarkResolvedRequest(post.postID)}
                        className="py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg text-center flex items-center gap-1"
                        title="Mark Resolved"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteRequest(post.postID)}
                      className="py-1.5 px-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-[#A82024] text-xs font-semibold rounded-lg text-center"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
            <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Listings Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              You haven't submitted any posts matching this filter.
            </p>
            <button
              onClick={() => onNavigate('create-post')}
              className="mt-6 px-5 py-2.5 bg-[#A82024] hover:bg-[#88171B] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Report Item Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

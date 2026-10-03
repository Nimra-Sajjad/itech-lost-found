import React, { useState } from 'react';
import { LostFoundPost } from '../oop/LostFoundPost';
import { ItemCard } from '../components/ItemCard';
import { Search, PlusCircle, AlertCircle } from 'lucide-react';

interface LostPageProps {
  posts: LostFoundPost[];
  onNavigate: (view: string) => void;
  onViewDetails: (postID: string) => void;
  onEditPost: (postID: string) => void;
  onDeletePost: (postID: string) => void;
  onMarkResolved: (postID: string) => void;
  currentUserId?: string;
  isAdmin?: boolean;
}

export const LostPage: React.FC<LostPageProps> = ({
  posts,
  onNavigate,
  onViewDetails,
  onEditPost,
  onDeletePost,
  onMarkResolved,
  currentUserId,
  isAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  // Filter ONLY Lost posts (Rule 9)
  const lostPosts = posts.filter((p) => p.type === 'LOST');

  const filteredPosts = lostPosts.filter((post) => {
    if (statusFilter === 'ACTIVE' && post.isResolved()) return false;
    if (statusFilter === 'RESOLVED' && !post.isResolved()) return false;
    return post.matchesQuery(searchQuery);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#A82024] text-white text-xs font-bold uppercase px-2.5 py-1 rounded-md">
              Directory
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-brand-title">
              Lost Items
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Belongings reported lost by iTECH students and faculty.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create-post')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A82024] hover:bg-[#88171B] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Report Lost Item
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lost items or locations..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#A82024]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'ALL'
                ? 'bg-[#A82024] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Lost ({lostPosts.length})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'ACTIVE'
                ? 'bg-[#A82024] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'RESOLVED'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Posts Grid or Empty State (Rule 36) */}
      <div className="mt-8">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <ItemCard
                key={post.postID}
                post={post}
                onViewDetails={onViewDetails}
                onEdit={onEditPost}
                onDelete={onDeletePost}
                onMarkResolved={onMarkResolved}
                isOwner={currentUserId === post.ownerID}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-14 h-14 bg-red-50 text-[#A82024] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Lost Items</h3>
            <p className="text-xs text-slate-500 mt-1">
              No lost items have been reported yet.
            </p>
            <div className="mt-6">
              <button
                onClick={() => onNavigate('create-post')}
                className="px-5 py-2.5 bg-[#A82024] hover:bg-[#88171B] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Report Lost Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

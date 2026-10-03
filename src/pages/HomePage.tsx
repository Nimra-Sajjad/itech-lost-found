import React, { useState } from 'react';
import { LostFoundPost } from '../oop/LostFoundPost';
import { ItemCard } from '../components/ItemCard';
import {
  Search,
  PlusCircle,
  ArrowDown,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Phone,
  LayoutGrid,
  List,
  Compass,
  ShieldCheck,
  Eye,
  X,
  Share2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface HomePageProps {
  posts: LostFoundPost[];
  onNavigate: (view: string) => void;
  onViewDetails: (postID: string) => void;
  onEditPost: (postID: string) => void;
  onDeletePost: (postID: string) => void;
  onMarkResolved: (postID: string) => void;
  currentUserId?: string;
  isAdmin?: boolean;
}

// Quick Smart Matcher Suggestions
const QUICK_ITEMS = ['Wallet', 'Earphones', 'Keys', 'Calculator', 'Notebook', 'Watch', 'Card'];

export const HomePage: React.FC<HomePageProps> = ({
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
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'LOST' | 'FOUND' | 'RESOLVED'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Interactive Quick Matcher State
  const [matcherKeyword, setMatcherKeyword] = useState('');
  const [quickPeekPost, setQuickPeekPost] = useState<LostFoundPost | null>(null);

  // Statistics
  const totalLost = posts.filter((p) => p.type === 'LOST' && !p.isResolved()).length;
  const totalFound = posts.filter((p) => p.type === 'FOUND').length;
  const totalResolved = posts.filter((p) => p.isResolved()).length;
  const recoveryRate = posts.length > 0 ? Math.round((totalResolved / posts.length) * 100) : 0;

  // Filter & Search Engine (Strict Rule 8: No categories!)
  const filteredPosts = posts
    .filter((post) => {
      // 1. Classification Filter
      if (activeFilter === 'LOST' && post.type !== 'LOST') return false;
      if (activeFilter === 'FOUND' && post.type !== 'FOUND') return false;
      if (activeFilter === 'RESOLVED' && !post.isResolved()) return false;

      // 2. Quick Matcher Keyword
      if (matcherKeyword) {
        if (!post.itemName.toLowerCase().includes(matcherKeyword.toLowerCase())) {
          return false;
        }
      }

      // 3. Query matching (Item name, Location, Details)
      return post.matchesQuery(searchQuery);
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.getPostedAtMillis() - a.getPostedAtMillis();
      return a.getPostedAtMillis() - b.getPostedAtMillis();
    });

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section with Campus Backdrop */}
      <section className="relative bg-[#0F2341] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-[#A82024] overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
          <img
            src="/images/hero_campus_quad_1791045749475.jpg"
            alt="iTECH University Campus Quad"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0F2341] via-[#16325C]/90 to-[#0F2341]/95" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          {/* Institutional Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-md border border-white/20 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Campus Lost &amp; Found Portal • iTECH University</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-brand-title tracking-tight text-white leading-tight">
            Lost Something? Found Something?
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            Help your university community reconnect with lost belongings safely, swiftly, and transparently.
          </p>

          {/* Dual Decision Action Cards */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* Action 1: Lost Item */}
            <div
              onClick={() => onNavigate('create-post')}
              className="group p-4 bg-white/10 hover:bg-white/15 border border-red-400/30 hover:border-red-400/60 rounded-2xl cursor-pointer transition-all duration-200 text-left backdrop-blur-sm flex items-center justify-between shadow-sm"
            >
              <div>
                <span className="text-[10px] font-bold text-red-300 uppercase tracking-widest block">
                  Misplaced an Item?
                </span>
                <span className="text-sm font-bold text-white group-hover:text-red-200 flex items-center gap-1.5">
                  I Lost Something <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#A82024] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                !
              </div>
            </div>

            {/* Action 2: Found Item */}
            <div
              onClick={() => onNavigate('create-post')}
              className="group p-4 bg-white/10 hover:bg-white/15 border border-blue-400/30 hover:border-blue-400/60 rounded-2xl cursor-pointer transition-all duration-200 text-left backdrop-blur-sm flex items-center justify-between shadow-sm"
            >
              <div>
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block">
                  Picked up Property?
                </span>
                <span className="text-sm font-bold text-white group-hover:text-blue-200 flex items-center gap-1.5">
                  I Found Something <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#16325C] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ✓
              </div>
            </div>
          </div>

          {/* Live Campus Recovery Pulse Ticker */}
          <div className="pt-6 border-t border-white/10 max-w-2xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-white font-mono">{posts.length}</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Total Listings</span>
              </div>
              <span className="text-white/20 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-red-300 font-mono">{totalLost}</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Active Lost</span>
              </div>
              <span className="text-white/20 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-emerald-400 font-mono">{totalResolved}</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Items Reunited</span>
              </div>
              <span className="text-white/20 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-amber-300 font-mono">{recoveryRate}%</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Recovery Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main id="items-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Interactive "Instant Matcher" Quick-Finder Assistant */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-[#16325C] rounded-xl shrink-0">
                <Compass className="w-5 h-5 text-[#16325C]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Campus Quick Matcher
                </h2>
                <p className="text-xs text-slate-500">
                  Select a common item keyword to instantly check if someone already reported finding it.
                </p>
              </div>
            </div>

            {matcherKeyword && (
              <button
                onClick={() => setMatcherKeyword('')}
                className="self-start md:self-auto text-xs font-semibold text-[#A82024] hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Clear Match Filter ({matcherKeyword})
              </button>
            )}
          </div>

          {/* Quick Item Keyword Chips */}
          <div className="pt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Quick Select:</span>
            {QUICK_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setMatcherKeyword(matcherKeyword === item ? '' : item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  matcherKeyword === item
                    ? 'bg-[#16325C] text-white shadow-xs scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Search Bar & Classification Controls (Rule 7 & 8) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          {/* Prominent Search Bar (Rule 7) */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an item, location or details..."
              className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16325C] focus:border-[#16325C] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 px-2 py-0.5 rounded font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Clean Filter Control (Rule 8: NO categories! Only [ All ] [ Lost ] [ Found ] [ Resolved ]) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-slate-100">
            {/* Main Classification Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
                Status:
              </span>
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === 'ALL'
                    ? 'bg-[#16325C] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({posts.length})
              </button>
              <button
                onClick={() => setActiveFilter('LOST')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === 'LOST'
                    ? 'bg-[#A82024] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-[#A82024]'
                }`}
              >
                Lost ({totalLost})
              </button>
              <button
                onClick={() => setActiveFilter('FOUND')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === 'FOUND'
                    ? 'bg-[#16325C] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#16325C]'
                }`}
              >
                Found ({totalFound})
              </button>
              <button
                onClick={() => setActiveFilter('RESOLVED')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === 'RESOLVED'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                Resolved ({totalResolved})
              </button>
            </div>

            {/* View Switcher & Sorting */}
            <div className="flex items-center gap-3 self-end lg:self-auto text-xs">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#16325C]"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
              </select>

              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${
                    viewMode === 'grid' ? 'bg-white text-[#16325C] shadow-xs' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${
                    viewMode === 'list' ? 'bg-white text-[#16325C] shadow-xs' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Feed View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Presentation (Grid View vs List View) */}
        <section>
          {filteredPosts.length > 0 ? (
            viewMode === 'grid' ? (
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
              /* Compact Feed / List View */
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
                {filteredPosts.map((post) => {
                  const isLost = post.type === 'LOST';
                  const isResolved = post.isResolved();

                  return (
                    <div
                      key={post.postID}
                      className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={post.image}
                          alt={post.itemName}
                          className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase ${
                                isLost ? 'bg-[#A82024]' : 'bg-[#16325C]'
                              }`}
                            >
                              {post.type}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {post.status}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">
                            {post.itemName}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1 text-[#A82024] font-medium">
                              <MapPin className="w-3.5 h-3.5" />
                              {post.location}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span>Posted: {post.postedAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => setQuickPeekPost(post)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Quick Peek
                        </button>
                        <button
                          onClick={() => onViewDetails(post.postID)}
                          className="px-4 py-2 bg-[#16325C] hover:bg-[#0F2341] text-white text-xs font-bold rounded-lg shadow-xs"
                        >
                          Full Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Empty State (Rule 36) */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Results Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Try searching for another item or location, or switch your active filters.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('ALL');
                    setMatcherKeyword('');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => onNavigate('create-post')}
                  className="px-4 py-2 bg-[#A82024] hover:bg-[#88171B] text-white text-xs font-bold rounded-lg"
                >
                  Report Item
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Campus Safe Drop-off & Verification Hub */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-[#16325C] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>iTECH Official Security Custody Protocol</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-brand-title text-slate-900">
                Safe In-Person Item Pick-up Points
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Found high-value belongings? Do not leave items unattended. Deposit them with campus security officers who log entries into the official institutional custody vault.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 w-full lg:w-auto text-xs">
              <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-xs">
                <span className="font-bold text-[#16325C] block">Gate 1 Main Guard Station</span>
                <span className="text-[11px] text-slate-500">24/7 Locked Custody • Helpline: Ext 402</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-xs">
                <span className="font-bold text-[#16325C] block">Library 2nd Floor Circulation</span>
                <span className="text-[11px] text-slate-500">Mon–Sat: 08:00 AM – 08:00 PM</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Quick Peek Drawer / Modal */}
      {quickPeekPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative aspect-16/9 bg-slate-100">
              <img
                src={quickPeekPost.image}
                alt={quickPeekPost.itemName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setQuickPeekPost(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md text-white uppercase shadow-sm ${
                    quickPeekPost.type === 'LOST' ? 'bg-[#A82024]' : 'bg-[#16325C]'
                  }`}
                >
                  {quickPeekPost.type}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md shadow-sm ${
                    quickPeekPost.isResolved() ? 'bg-emerald-700 text-white' : 'bg-slate-900/80 text-white'
                  }`}
                >
                  {quickPeekPost.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold font-brand-title text-slate-900">
                  {quickPeekPost.itemName}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                  <MapPin className="w-4 h-4 text-[#A82024]" />
                  <span>{quickPeekPost.location}</span>
                </div>
              </div>

              {quickPeekPost.details && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                  "{quickPeekPost.details}"
                </p>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Posted: {quickPeekPost.postedAt}</span>
                <span>Owner: {quickPeekPost.ownerName}</span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    const id = quickPeekPost.postID;
                    setQuickPeekPost(null);
                    onViewDetails(id);
                  }}
                  className="flex-1 py-2.5 px-4 bg-[#16325C] hover:bg-[#0F2341] text-white text-xs font-bold rounded-xl shadow-xs text-center"
                >
                  Open Full Post &amp; Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { User } from '../oop/User';
import { Admin } from '../oop/Admin';
import { LostFoundPost } from '../oop/LostFoundPost';
import { Report } from '../oop/Report';
import { Student } from '../oop/Student';
import { DatabaseService } from '../oop/DatabaseService';
import {
  LayoutDashboard,
  FileText,
  Shield,
  Users,
  Database,
  Search,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Lock,
  UserX,
  UserCheck,
  Flag,
  ArrowRight,
} from 'lucide-react';

interface AdminDashboardPageProps {
  currentUser: User | null;
  posts: LostFoundPost[];
  reports: Report[];
  students: Student[];
  currentView: string;
  onNavigate: (view: string) => void;
  onViewDetails: (postID: string) => void;
  onEditPost: (postID: string) => void;
  onDeletePost: (postID: string) => void;
  onMarkResolved: (postID: string) => void;
  onDismissReport: (reportID: string) => void;
  onRemoveReportedPost: (reportID: string) => void;
  onToggleStudentStatus: (studentID: string) => void;
  onRestoreBackupFile: (file: File) => void;
  onOpenAuth: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentUser,
  posts,
  reports,
  students,
  currentView,
  onNavigate,
  onViewDetails,
  onEditPost,
  onDeletePost,
  onMarkResolved,
  onDismissReport,
  onRemoveReportedPost,
  onToggleStudentStatus,
  onRestoreBackupFile,
  onOpenAuth,
}) => {
  type AdminTab = 'dashboard' | 'posts' | 'reports' | 'students' | 'backup';
  const tabFromView = (view: string): AdminTab => {
    const key = view.replace('admin-', '');
    return (['posts', 'reports', 'students', 'backup'] as const).includes(key as never) ? (key as AdminTab) : 'dashboard';
  };
  const [activeTab, setActiveTab] = useState<AdminTab>(tabFromView(currentView));
  const [lastView, setLastView] = useState(currentView);
  // Keep the tab in sync when the navbar changes the view
  if (lastView !== currentView) {
    setLastView(currentView);
    setActiveTab(tabFromView(currentView));
  }
  const [searchPostsQuery, setSearchPostsQuery] = useState('');
  const [postsFilter, setPostsFilter] = useState<'ALL' | 'LOST' | 'FOUND' | 'RESOLVED'>('ALL');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // ACCESS CONTROL (Rule 20): Deny access if not admin
  const isAdmin = currentUser instanceof Admin || currentUser?.role === 'ADMIN';

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 text-[#A82024] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold font-brand-title text-slate-900">
            Access Denied
          </h1>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            You do not possess system administrative clearance to access the iTECH Campus Security Portal.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 bg-[#16325C] hover:bg-[#0F2341] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Return to Home
            </button>
            <button
              onClick={() => onOpenAuth()}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Authenticate as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  const db = DatabaseService.getInstance();
  const stats = db.getStatistics();

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (postsFilter === 'LOST' && p.type !== 'LOST') return false;
    if (postsFilter === 'FOUND' && p.type !== 'FOUND') return false;
    if (postsFilter === 'RESOLVED' && !p.isResolved()) return false;
    return p.matchesQuery(searchPostsQuery);
  });

  const pendingReports = reports.filter((r) => r.status === 'PENDING');

  // Filter students
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.universityID.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  // Trigger Backup Download
  const handleDownloadBackup = () => {
    const backup = db.createBackup(currentUser as Admin);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itech_lostfound_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setRestoreConfirmOpen(true);
    }
  };

  const executeRestore = () => {
    if (pendingFile) {
      onRestoreBackupFile(pendingFile);
      setPendingFile(null);
      setRestoreConfirmOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header Banner */}
      <div className="bg-[#16325C] text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-8 border-[#A82024]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-300 uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            <span>Administrative Command Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-brand-title tracking-tight mt-1 text-white">
            Security &amp; Affairs Dashboard
          </h1>
          <p className="text-xs text-blue-200 mt-1">
            Logged in as <strong>{currentUser.name}</strong> • System-wide CRUD &amp; Moderation Authority
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap bg-white/10 p-1.5 rounded-xl text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-white text-[#16325C] shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'posts' ? 'bg-white text-[#16325C] shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Manage Posts
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'bg-[#A82024] text-white shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            Reports ({reports.filter((r) => r.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'students' ? 'bg-white text-[#16325C] shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'backup' ? 'bg-white text-[#16325C] shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Backup
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: DASHBOARD OVERVIEW (Rule 21) */}
      {activeTab === 'dashboard' && (
        <div className="mt-8 space-y-8">
          {/* Key Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Posts</span>
              <span className="text-2xl font-extrabold text-[#16325C] mt-1 block">{stats.totalPosts}</span>
              <span className="text-[10px] text-slate-400">All submissions</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-[#A82024] uppercase tracking-wider block">Lost Items</span>
              <span className="text-2xl font-extrabold text-[#A82024] mt-1 block">{stats.lostPosts}</span>
              <span className="text-[10px] text-slate-400">Awaiting return</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-[#16325C] uppercase tracking-wider block">Found Items</span>
              <span className="text-2xl font-extrabold text-[#16325C] mt-1 block">{stats.foundPosts}</span>
              <span className="text-[10px] text-slate-400">Turned in</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Resolved</span>
              <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{stats.resolvedPosts}</span>
              <span className="text-[10px] text-slate-400">Reunited</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Reported</span>
              <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{stats.reportedPosts}</span>
              <span className="text-[10px] text-slate-400">Pending review</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Students</span>
              <span className="text-2xl font-extrabold text-indigo-700 mt-1 block">{stats.registeredStudents}</span>
              <span className="text-[10px] text-slate-400">Registered</span>
            </div>
          </div>

          {/* Quick Action Hub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Recent System Reports</span>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="text-xs text-[#A82024] hover:underline flex items-center gap-1 font-semibold"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </h3>
              {pendingReports.length > 0 ? (
                <div className="space-y-3">
                  {pendingReports.slice(0, 3).map((r) => (
                    <div
                      key={r.reportID}
                      className="p-3 bg-red-50/60 rounded-xl border border-red-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block truncate">{r.postTitle}</span>
                        <span className="text-[11px] text-[#A82024] font-semibold">{r.reason}</span>
                        <span className="text-[10px] text-slate-500 ml-2">by {r.reporterName}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-amber-100 text-amber-800">
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No pending reports.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
                Campus Security Notice
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                As an iTECH Security Administrator, you possess full administrative privileges to edit inaccurate item details, remove abusive or duplicate posts, contact students directly, and safeguard student account credentials.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setActiveTab('posts')}
                  className="px-3.5 py-2 bg-[#16325C] text-white text-xs font-bold rounded-lg"
                >
                  Inspect All Posts
                </button>
                <button
                  onClick={() => setActiveTab('backup')}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
                >
                  Download Data Snapshot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MANAGE POSTS (Rule 22) */}
      {activeTab === 'posts' && (
        <div className="mt-8 space-y-6">
          {/* Search & Filter Header */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchPostsQuery}
                onChange={(e) => setSearchPostsQuery(e.target.value)}
                placeholder="Search posts by name or location..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto">
              <button
                onClick={() => setPostsFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  postsFilter === 'ALL' ? 'bg-[#16325C] text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                All ({posts.length})
              </button>
              <button
                onClick={() => setPostsFilter('LOST')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  postsFilter === 'LOST' ? 'bg-[#A82024] text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => setPostsFilter('FOUND')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  postsFilter === 'FOUND' ? 'bg-[#16325C] text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Found
              </button>
              <button
                onClick={() => setPostsFilter('RESOLVED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  postsFilter === 'RESOLVED' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Owner / Contact</th>
                    <th className="py-3 px-4">Posted Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPosts.map((post) => (
                    <tr key={post.postID} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={post.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <span className="line-clamp-1">{post.itemName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${
                            post.type === 'LOST' ? 'bg-[#A82024]' : 'bg-[#16325C]'
                          }`}
                        >
                          {post.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{post.location}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{post.ownerName}</span>
                        <span className="text-[10px] text-slate-400">{post.contactNumber}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{post.postedAt}</td>
                      <td className="py-3 px-4">
                        {post.isResolved() ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            RESOLVED
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewDetails(post.postID)}
                            title="View Details"
                            className="p-1.5 text-slate-600 hover:text-[#16325C] hover:bg-slate-100 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditPost(post.postID)}
                            title="Edit Post"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {!post.isResolved() && (
                            <button
                              onClick={() => onMarkResolved(post.postID)}
                              title="Mark as Resolved"
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeletePost(post.postID)}
                            title="Delete Post"
                            className="p-1.5 text-[#A82024] hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: REPORTED POSTS (Rule 24) */}
      {activeTab === 'reports' && (
        <div className="mt-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-brand-title">
              Moderation Reports Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review flagged posts reported by students for spam, fake entries, or inappropriate content.
            </p>
          </div>

          {pendingReports.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pendingReports.map((report) => (
                <div
                  key={report.reportID}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-[#A82024]">
                        {report.reason}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">"{report.postTitle}"</h4>
                      <span className="text-[10px] text-slate-400">Post ID: {report.postID}</span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Reported by: <strong>{report.reporterName}</strong> ({report.reporterEmail})
                    </p>

                    {report.details && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                        Student remark: "{report.details}"
                      </p>
                    )}
                  </div>

                  {/* Actions (Rule 24: Review, Remove Post, Dismiss Report) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onViewDetails(report.postID)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                    >
                      Review Post
                    </button>
                    <button
                      onClick={() => onRemoveReportedPost(report.reportID)}
                      className="px-3 py-1.5 bg-[#A82024] hover:bg-[#88171B] text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Remove Post
                    </button>
                    <button
                      onClick={() => onDismissReport(report.reportID)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-semibold rounded-lg"
                    >
                      Dismiss Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Zero Pending Reports</h3>
              <p className="text-xs text-slate-500 mt-1">
                The university portal is currently clean with no flagged listings.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 4: MANAGE STUDENTS (Rule 23) */}
      {activeTab === 'students' && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-brand-title">
                Registered Students Directory
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Security note: Passwords remain cryptographically hashed and invisible to admins.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                placeholder="Search students or ID..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">University ID</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Posts Count</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Access Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => {
                    const postCount = posts.filter((p) => p.ownerID === st.userID).length;
                    const isActive = st.isActive();

                    return (
                      <tr key={st.userID} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#16325C]">
                          {st.universityID}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{st.email}</td>
                        <td className="py-3 px-4 text-slate-600">{st.phone}</td>
                        <td className="py-3 px-4 font-semibold">{postCount} item(s)</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isActive ? 'ACTIVE' : 'DISABLED'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onToggleStudentStatus(st.userID)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1 ${
                              isActive
                                ? 'bg-red-50 hover:bg-red-100 text-[#A82024] border border-red-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                Disable
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                Enable
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: BACKUP & RESTORE (Rule 25) */}
      {activeTab === 'backup' && (
        <div className="mt-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-brand-title">
              System Backup &amp; Disaster Recovery
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Securely export or restore the complete institutional state (users, items, moderation queue, timestamps).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Backup Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-50 text-[#16325C] rounded-xl flex items-center justify-center mb-4">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Create Snapshot Backup</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Downloads a comprehensive JSON archive containing all verified users, active &amp; resolved lost/found posts, and student moderation reports.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={handleDownloadBackup}
                  className="w-full py-2.5 px-4 bg-[#16325C] hover:bg-[#0F2341] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Backup JSON Archive
                </button>
              </div>
            </div>

            {/* Restore Backup Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-red-50 text-[#A82024] rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Restore System Backup</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Restore the database from a previously generated JSON snapshot. Requires administrative confirmation before modifying active records.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <label className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-300">
                  <Upload className="w-4 h-4" />
                  <span>Select Backup File to Restore</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Reset Demo Data Button */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Factory Reset Demo State</span>
              <span className="text-slate-500">Restore default iTECH sample posts and test accounts.</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all posts and users to official initial demo state?')) {
                  db.resetToDefaultSeed();
                  window.location.reload();
                }
              }}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset State
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Restore */}
      {restoreConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-[#A82024] mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 text-base">Confirm System Restore</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to restore the system from file <strong>{pendingFile?.name}</strong>? This will replace existing posts and user state with the backup archive data.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setRestoreConfirmOpen(false);
                  setPendingFile(null);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={executeRestore}
                className="px-4 py-2 bg-[#A82024] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

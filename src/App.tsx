import React, { useState, useEffect } from 'react';
import { DatabaseService } from './oop/DatabaseService';
import { LostFoundPost } from './oop/LostFoundPost';
import { User } from './oop/User';
import { Admin } from './oop/Admin';
import { Student } from './oop/Student';
import { Report } from './oop/Report';
import { PostType, ReportReason } from './oop/types';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ReportModal } from './components/ReportModal';

// Pages
import { HomePage } from './pages/HomePage';
import { LostPage } from './pages/LostPage';
import { FoundPage } from './pages/FoundPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { EditPostPage } from './pages/EditPostPage';
import { MyPostsPage } from './pages/MyPostsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { HelpPage } from './pages/HelpPage';

export default function App() {
  const db = DatabaseService.getInstance();

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedPostID, setSelectedPostID] = useState<string | null>(null);

  // Data State
  const [currentUser, setCurrentUser] = useState<User | null>(db.getCurrentUser());
  const [posts, setPosts] = useState<LostFoundPost[]>(db.getAllPosts());
  const [reports, setReports] = useState<Report[]>(db.getAllReports());
  const [students, setStudents] = useState<Student[]>(db.getAllStudents());

  // Modals State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'student_login' | 'student_register' | 'admin_login'>('student_login');

  // Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetPost, setReportTargetPost] = useState<{ id: string; title: string } | null>(null);

  // Confirmation Modal
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmVariant: 'danger' | 'success' | 'primary';
    onConfirmAction: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    confirmVariant: 'danger',
    onConfirmAction: () => {},
  });

  // Notification Banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const refreshData = () => {
    setCurrentUser(db.getCurrentUser());
    setPosts(db.getAllPosts());
    setReports(db.getAllReports());
    setStudents(db.getAllStudents());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Shared data: surface save errors and pick up other people's changes
  useEffect(() => {
    if (!db.isRemote()) return;
    db.setErrorHandler((message) => showNotification(message, 'error'));
    const sync = () => {
      db.refreshFromRemote()
        .then((changed) => {
          if (changed) refreshData();
        })
        .catch(() => {});
    };
    const timer = window.setInterval(sync, 20000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') sync();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      db.setErrorHandler(null);
    };
  }, []);

  // Deep links: #post=<id> opens that post
  useEffect(() => {
    const openFromHash = () => {
      const m = /^#post=(.+)$/.exec(window.location.hash);
      if (m) {
        const id = decodeURIComponent(m[1]);
        setSelectedPostID(id);
        setCurrentView('post-detail');
      }
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  // --- Handlers ---
  const handleOpenAuth = (mode: 'student_login' | 'student_register' | 'admin_login' = 'student_login') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    db.logout();
    refreshData();
    showNotification('Logged out successfully.', 'success');
    if (currentView.startsWith('admin') || currentView === 'my-posts') {
      setCurrentView('home');
    }
  };

  const handleViewPostDetails = (postID: string) => {
    setSelectedPostID(postID);
    setCurrentView('post-detail');
    window.history.replaceState(null, '', `#post=${encodeURIComponent(postID)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditPost = (postID: string) => {
    const post = db.getPostByID(postID);
    if (!post) {
      showNotification('This page does not exist.', 'error');
      return;
    }

    // Ownership check (Rule 5 & 16)
    if (!currentUser) {
      showNotification('Please login to edit this post.', 'error');
      handleOpenAuth('student_login');
      return;
    }

    if (!currentUser.canModifyPost(post.ownerID)) {
      showNotification('You are not authorized to edit this post.', 'error');
      return;
    }

    setSelectedPostID(postID);
    setCurrentView('edit-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Request with Confirmation (Rule 17)
  const handleDeleteRequest = (postID: string) => {
    const post = db.getPostByID(postID);
    if (!post) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Delete Post',
      message: 'Are you sure you want to delete this post?',
      confirmLabel: 'Delete',
      confirmVariant: 'danger',
      onConfirmAction: () => {
        try {
          if (!currentUser) throw new Error('Please login to delete this post.');
          db.deletePost(currentUser, postID);
          refreshData();
          showNotification('Post has been permanently deleted.', 'success');
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          if (currentView === 'post-detail' || currentView === 'edit-post') {
            setCurrentView('home');
          }
        } catch (err: any) {
          showNotification(err.message || 'Error deleting post.', 'error');
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Mark Resolved Request with Confirmation (Rule 14)
  const handleMarkResolvedRequest = (postID: string) => {
    const post = db.getPostByID(postID);
    if (!post) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Mark as Resolved',
      message: 'Are you sure you want to mark this post as resolved?',
      confirmLabel: 'Yes, Mark as Resolved',
      confirmVariant: 'success',
      onConfirmAction: () => {
        try {
          if (!currentUser) throw new Error('Please login to update this post.');
          db.markPostResolved(currentUser, postID);
          refreshData();
          showNotification('Item marked as RESOLVED.', 'success');
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        } catch (err: any) {
          showNotification(err.message || 'Error resolving post.', 'error');
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Reporting Inappropriate Posts (Rule 19)
  const handleOpenReportModal = (postID: string, postTitle: string) => {
    if (!currentUser) {
      showNotification('Please login to report a post.', 'error');
      handleOpenAuth('student_login');
      return;
    }
    setReportTargetPost({ id: postID, title: postTitle });
    setReportModalOpen(true);
  };

  const handleSubmitReport = (reason: ReportReason, details: string) => {
    if (!currentUser || !reportTargetPost) return;
    try {
      db.createReport(currentUser, reportTargetPost.id, reason, details);
      refreshData();
      showNotification('Report submitted to campus security for review.', 'success');
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Admin Actions
  const handleDismissReport = (reportID: string) => {
    if (currentUser instanceof Admin || currentUser?.role === 'ADMIN') {
      db.dismissReport(currentUser as Admin, reportID);
      refreshData();
      showNotification('Report dismissed.', 'success');
    }
  };

  const handleRemoveReportedPost = (reportID: string) => {
    if (currentUser instanceof Admin || currentUser?.role === 'ADMIN') {
      db.removeReportedPost(currentUser as Admin, reportID);
      refreshData();
      showNotification('Inappropriate post removed and report resolved.', 'success');
    }
  };

  const handleToggleStudentStatus = (studentID: string) => {
    if (currentUser instanceof Admin || currentUser?.role === 'ADMIN') {
      db.toggleUserStatus(currentUser as Admin, studentID);
      refreshData();
      showNotification('Student account status updated.', 'success');
    }
  };

  const handleRestoreBackupFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const payload = JSON.parse(content);
        if (currentUser instanceof Admin || currentUser?.role === 'ADMIN') {
          db.restoreBackup(currentUser as Admin, payload);
          refreshData();
          showNotification('System backup successfully restored!', 'success');
        }
      } catch (err: any) {
        showNotification(err.message || 'Failed to parse backup archive.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Selected post lookup for details / edit
  const activePost = selectedPostID ? db.getPostByID(selectedPostID) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-[#16325C] selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-3 ${
            notification.type === 'success'
              ? 'bg-emerald-800 text-white border-emerald-900'
              : 'bg-[#A82024] text-white border-red-900'
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {/* Official Navigation Header */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => {
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Routed View */}
      <div className="flex-1">
        {currentView === 'home' && (
          <HomePage
            posts={posts}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewDetails={handleViewPostDetails}
            onEditPost={handleEditPost}
            onDeletePost={handleDeleteRequest}
            onMarkResolved={handleMarkResolvedRequest}
            currentUserId={currentUser?.userID}
            isAdmin={currentUser?.role === 'ADMIN'}
          />
        )}

        {currentView === 'lost' && (
          <LostPage
            posts={posts}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewDetails={handleViewPostDetails}
            onEditPost={handleEditPost}
            onDeletePost={handleDeleteRequest}
            onMarkResolved={handleMarkResolvedRequest}
            currentUserId={currentUser?.userID}
            isAdmin={currentUser?.role === 'ADMIN'}
          />
        )}

        {currentView === 'found' && (
          <FoundPage
            posts={posts}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewDetails={handleViewPostDetails}
            onEditPost={handleEditPost}
            onDeletePost={handleDeleteRequest}
            onMarkResolved={handleMarkResolvedRequest}
            currentUserId={currentUser?.userID}
            isAdmin={currentUser?.role === 'ADMIN'}
          />
        )}

        {currentView === 'create-post' && (
          <CreatePostPage
            currentUser={currentUser}
            onPostCreated={(newID) => {
              refreshData();
              showNotification('Item successfully posted to iTECH directory!', 'success');
              setSelectedPostID(newID);
              setCurrentView('post-detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={() => handleOpenAuth('student_login')}
            onCancel={() => setCurrentView('home')}
            onCreatePostService={(data) => {
              const newPost = db.createPost(currentUser!, data);
              return newPost.postID;
            }}
          />
        )}

        {currentView === 'post-detail' && (
          activePost ? (
            <PostDetailPage
              post={activePost}
              currentUser={currentUser}
              onNavigateBack={() => setCurrentView('home')}
              onEdit={handleEditPost}
              onDeleteRequest={handleDeleteRequest}
              onMarkResolvedRequest={handleMarkResolvedRequest}
              onOpenReportModal={handleOpenReportModal}
              onOpenAuth={() => handleOpenAuth('student_login')}
            />
          ) : (
            <NotFoundPage onNavigate={setCurrentView} />
          )
        )}

        {currentView === 'edit-post' && (
          activePost ? (
            <EditPostPage
              post={activePost}
              currentUser={currentUser}
              onPostUpdated={(postID) => {
                refreshData();
                showNotification('Post successfully updated.', 'success');
                setSelectedPostID(postID);
                setCurrentView('post-detail');
              }}
              onCancel={() => {
                if (selectedPostID) setCurrentView('post-detail');
                else setCurrentView('home');
              }}
              onUpdatePostService={(postID, updates) => {
                db.updatePost(currentUser!, postID, updates);
              }}
            />
          ) : (
            <NotFoundPage onNavigate={setCurrentView} />
          )
        )}

        {currentView === 'my-posts' && (
          <MyPostsPage
            currentUser={currentUser}
            posts={posts}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewDetails={handleViewPostDetails}
            onEdit={handleEditPost}
            onDeleteRequest={handleDeleteRequest}
            onMarkResolvedRequest={handleMarkResolvedRequest}
            onOpenAuth={() => handleOpenAuth('student_login')}
          />
        )}

        {/* Admin Views */}
        {(currentView === 'admin-dashboard' ||
          currentView === 'admin-posts' ||
          currentView === 'admin-reports' ||
          currentView === 'admin-students' ||
          currentView === 'admin-backup') && (
          <AdminDashboardPage
            currentUser={currentUser}
            posts={posts}
            reports={reports}
            students={students}
            currentView={currentView}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewDetails={handleViewPostDetails}
            onEditPost={handleEditPost}
            onDeletePost={handleDeleteRequest}
            onMarkResolved={handleMarkResolvedRequest}
            onDismissReport={handleDismissReport}
            onRemoveReportedPost={handleRemoveReportedPost}
            onToggleStudentStatus={handleToggleStudentStatus}
            onRestoreBackupFile={handleRestoreBackupFile}
            onOpenAuth={() => handleOpenAuth('admin_login')}
          />
        )}

        {currentView === 'help' && (
          <HelpPage onNavigate={setCurrentView} />
        )}

        {currentView === 'not-found' && (
          <NotFoundPage onNavigate={setCurrentView} />
        )}
      </div>

      {/* Official Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={() => {
          refreshData();
          showNotification('Authentication successful. Welcome to iTECH Portal.', 'success');
        }}
      />

      <ReportModal
        isOpen={reportModalOpen}
        postTitle={reportTargetPost?.title || ''}
        onClose={() => {
          setReportModalOpen(false);
          setReportTargetPost(null);
        }}
        onSubmit={handleSubmitReport}
      />

      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onConfirm={confirmDialog.onConfirmAction}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

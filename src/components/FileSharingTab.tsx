import React, { useState } from 'react';
import { CommitteeFile, User } from '../types';
import { FolderKanban, Upload, Search, Download, Trash2, FileText, FileSpreadsheet, FileImage, FileVideo, Archive, Sparkles, Plus, X, Eye } from 'lucide-react';

interface FileSharingTabProps {
  files: CommitteeFile[];
  currentUser: User;
  onUploadFile: (fileData: any) => void;
  onDeleteFile: (fileId: string) => void;
  onDownloadFile: (fileId: string) => void;
  darkMode: boolean;
}

export const FileSharingTab: React.FC<FileSharingTabProps> = ({
  files,
  currentUser,
  onUploadFile,
  onDeleteFile,
  onDownloadFile,
  darkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<CommitteeFile | null>(null);

  // Upload Form State
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState<'Research' | 'Budget' | 'Protocols' | 'Presentations' | 'General'>('Research');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [fileSize, setFileSize] = useState(1500000);

  const categories = ['All', 'Research', 'Budget', 'Protocols', 'Presentations', 'General'];

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.uploaderName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'spreadsheet':
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'image':
      case 'png':
      case 'jpg':
        return <FileImage className="w-5 h-5 text-indigo-500" />;
      case 'video':
      case 'mp4':
        return <FileVideo className="w-5 h-5 text-amber-500" />;
      case 'archive':
      case 'zip':
        return <Archive className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    onUploadFile({
      name: fileName.endsWith('.' + fileType) ? fileName : `${fileName}.${fileType}`,
      size: fileSize,
      type: fileType,
      category,
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      description,
    });

    setFileName('');
    setDescription('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Committee File Sharing</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Upload, organize, preview, and download all committee records</p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-2 shadow-md shadow-indigo-500/20 transition-all self-start md:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New File</span>
        </button>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search files by name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border transition-all ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : darkMode
                  ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              darkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
            } shadow-xs space-y-4`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  darkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {file.category}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1" title={file.name}>
                  {file.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {file.description || 'No description provided.'}
                </p>
              </div>

              {/* AI Summary badge if available */}
              {file.aiSummary && (
                <div className={`p-2.5 rounded-xl border text-[11px] ${
                  darkMode ? 'bg-slate-800/40 border-slate-800 text-indigo-300' : 'bg-indigo-50/50 border-indigo-100/60 text-indigo-900'
                } flex items-start space-x-2`}>
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="line-clamp-2 italic">{file.aiSummary}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">{file.uploaderName}</p>
                <p className="text-[10px]">{new Date(file.uploadDate).toLocaleDateString()} • {(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setSelectedFileForPreview(file)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Preview Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDownloadFile(file.id)}
                  className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
                {currentUser.role === 'Admin' && (
                  <button
                    onClick={() => onDeleteFile(file.id)}
                    className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'} shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Upload Committee File</h3>
                  <p className="text-xs text-slate-500">Supports PDFs, spreadsheets, presentations, and documents</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4_Budget_Review"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                  >
                    <option value="Research">Research</option>
                    <option value="Budget">Budget</option>
                    <option value="Protocols">Protocols</option>
                    <option value="Presentations">Presentations</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">File Format</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="spreadsheet">Spreadsheet (.xlsx)</option>
                    <option value="docx">Word Document (.docx)</option>
                    <option value="image">Image (.png/.jpg)</option>
                    <option value="archive">Archive (.zip)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Provide a brief summary or notes about this file..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFileForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-xl rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'} shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {getFileIcon(selectedFileForPreview.type)}
                </div>
                <div>
                  <h3 className="font-bold text-base truncate max-w-sm">{selectedFileForPreview.name}</h3>
                  <p className="text-xs text-slate-500">{selectedFileForPreview.category} • v{selectedFileForPreview.version}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-100'} space-y-2`}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</p>
                <p className="text-xs text-slate-700 dark:text-slate-300">{selectedFileForPreview.description || 'No description provided.'}</p>
              </div>

              {selectedFileForPreview.aiSummary && (
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-indigo-950/30 border-indigo-900/50' : 'bg-indigo-50/70 border-indigo-100'} space-y-2`}>
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI Document Summary</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{selectedFileForPreview.aiSummary}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400">Uploaded By</p>
                  <p className="font-semibold text-slate-800 dark:text-white mt-0.5">{selectedFileForPreview.uploaderName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Upload Date</p>
                  <p className="font-semibold text-slate-800 dark:text-white mt-0.5">{new Date(selectedFileForPreview.uploadDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400">File Size</p>
                  <p className="font-semibold text-slate-800 dark:text-white mt-0.5">{(selectedFileForPreview.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div>
                  <p className="text-slate-400">Total Downloads</p>
                  <p className="font-semibold text-slate-800 dark:text-white mt-0.5">{selectedFileForPreview.downloads}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onDownloadFile(selectedFileForPreview.id);
                  setSelectedFileForPreview(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

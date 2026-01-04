import React from 'react';
import { X, Calendar, Clock, RotateCcw, Trash2 } from 'lucide-react';
import { THEMES, AppSettings, HistoryEntry } from '../types';
import { translations } from '../utils/translations';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onClearHistory: () => void;
  settings: AppSettings;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onClearHistory, 
  settings 
}) => {
  if (!isOpen) return null;

  const themeColors = THEMES[settings.theme];
  const t = translations[settings.language];

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const formatDate = (timestamp: number) => {
    // Basic date formatting, locale support could be improved but sufficient
    const date = new Date(timestamp);
    if (settings.language === 'hi') {
        return date.toLocaleDateString('hi-IN', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
        });
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className={`p-5 flex justify-between items-center ${themeColors.bg} border-b border-black/5`}>
          <div className="flex items-center gap-2">
            <Clock className={`w-5 h-5 ${themeColors.accent}`} />
            <h2 className={`font-bold text-xl ${themeColors.accent}`}>{t.history}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className={`w-5 h-5 ${themeColors.accent}`} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <RotateCcw className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">{t.noHistory}</p>
              <p className="text-xs opacity-70 mt-1">{t.completeSession}</p>
            </div>
          ) : (
            history.map((entry) => (
              <div 
                key={entry.id} 
                className="bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-md transition-shadow flex justify-between items-center group"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <Calendar size={12} />
                    {formatDate(entry.timestamp)}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${themeColors.accent}`}>
                      {entry.totalCount}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">{t.counts}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block mb-2 ${themeColors.bg} ${themeColors.accent}`}>
                    {entry.rounds} {t.rounds}
                  </div>
                  <div className="text-sm text-slate-500 flex items-center justify-end gap-1">
                    <Clock size={12} />
                    {formatDuration(entry.durationSeconds)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => {
                if(window.confirm('Are you sure you want to clear your history?')) {
                  onClearHistory();
                }
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              {t.clearHistory}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
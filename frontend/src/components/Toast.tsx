import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`
        win95-window p-3 max-w-sm border-win95-raised
        ${type === 'success' 
          ? 'bg-win95-gray' 
          : 'bg-win95-gray'
        }
      `}>
        <div className="win95-title-bar bg-win95-blue text-white px-2 py-1 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="win95-title-buttons flex space-x-1 mr-2">
              <div className="w-2 h-2 bg-win95-gray border-win95-raised"></div>
            </div>
            <span className="font-bold text-xs">
              {type === 'success' ? '✅ Success' : '❌ Error'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-600 px-1 text-xs font-bold"
          >
            ×
          </button>
        </div>
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-xs font-mono text-black">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

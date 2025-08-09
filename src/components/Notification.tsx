import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Notification as NotificationType } from '../types';

interface NotificationProps {
  notification: NotificationType;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative w-full p-4 mb-4 overflow-hidden bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg shadow-blue-500/10 pointer-events-auto transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02]"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#42E695] via-[#4F87D3] to-[#F48F40] shadow-md">
          <img
            src={notification.iconUrl}
            alt="app icon"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Content */}
        <div className="flex-grow pt-0.5">
          <p className="font-semibold text-slate-900 text-[15px] leading-tight">
            {notification.title}
          </p>
          <p className="text-slate-600 text-[15px] leading-snug mt-1">
            {notification.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex-shrink-0 w-7 h-7 bg-black/5 rounded-full flex items-center justify-center text-slate-500 hover:bg-black/10 hover:text-slate-800 transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default Notification;

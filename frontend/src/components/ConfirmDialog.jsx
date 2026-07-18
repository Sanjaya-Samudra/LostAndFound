import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmDialog.css';

export const ConfirmDialog = ({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, danger }) => {
  if (!open) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
        <button className="confirm-close" onClick={onCancel}><X size={18} /></button>
        <div className="confirm-icon-wrapper">
          <AlertTriangle size={32} className={danger ? 'confirm-icon-danger' : 'confirm-icon-warn'} />
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-outline" onClick={onCancel}>{cancelLabel || 'Cancel'}</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

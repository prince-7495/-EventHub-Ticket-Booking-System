import React from 'react';

const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <div className="error-message">
      <span className="error-icon">✕</span>
      <span>{message}</span>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss}>
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

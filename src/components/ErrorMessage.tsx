// components/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div style={{ color: 'red', marginBottom: '1rem' }}>
      {message}
    </div>
  );
};
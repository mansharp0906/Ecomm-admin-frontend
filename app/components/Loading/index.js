import React from 'react';

export default function LoadingOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          border: '4px solid #f3f3f3', // Light grey background
          borderTop: '4px solid #3498db', // Blue color for the spinner top stroke
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        }}
      />
      <span style={{ marginLeft: '10px', color: 'white', fontSize: '1.2rem' }}>
        Loading ...
      </span>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}

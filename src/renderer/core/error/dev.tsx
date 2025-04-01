import type React from 'react';
import { useState } from 'react';
import logo from '@renderer/core/assets/logo.svg';
import './dev.scss';

interface DevErrorBoundaryProps {
  error: Error;
}

function DevErrorBoundary({ error }: DevErrorBoundaryProps): React.ReactElement {
  const [isStackVisible, setIsStackVisible] = useState(true);

  const toggleStackVisibility = () => {
    setIsStackVisible(!isStackVisible);
  };

  const restartApp = () => {
    window.location.reload(); // Simple way to restart the app (for web apps or Electron)
  };

  return (
    <section className="fallback">
      <img src={logo} alt="Logo" />
      <header className="fallback__header">
        <h1 className="fallback__title">Oh no! Something went wrong</h1>
      </header>
      <button 
        type="button"
        className="fallback__restart-btn" 
        onClick={restartApp}
        onKeyDown={(e) => e.key === 'Enter' && restartApp()}
      >
        Restart Application
      </button>

      {/* <span className={`fallback__toggle-icon ${isStackVisible ? 'open' : ''}`}>▼</span> */}
      {isStackVisible && (
        <div className="fallback__body">
          <button
            type="button"
            className="fallback__toggle" 
            onClick={toggleStackVisibility}
            onKeyDown={(e) => e.key === 'Enter' && toggleStackVisibility()}
          >
            <span>{isStackVisible ? 'Hide Error Trace' : 'Show Error Trace'}</span>
          </button>
          {/* <p>
          <strong>{error.message}</strong>
        </p> */}

          <pre className="fallback__stacktrace">{error.stack}</pre>
        </div>
      )}
    </section>
  );
}

export default DevErrorBoundary;

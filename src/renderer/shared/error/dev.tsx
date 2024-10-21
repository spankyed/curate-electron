import React, { useState } from 'react';
import logo from '@renderer/assets/logo.svg';
import './dev.scss';

function DevErrorBoundary({ error }) {
  const [isStackVisible, setIsStackVisible] = useState(true);

  const toggleStackVisibility = () => {
    setIsStackVisible(!isStackVisible);
  };

  const restartApp = () => {
    window.location.reload(); // Simple way to restart the app (for web apps or Electron)
  };

  return (
    <section className="fallback">
      <header className="fallback__header">
        <h1 className="fallback__title">Oh no! Something went wrong</h1>
      </header>
      <img src={logo} alt="Logo" />
      <button className="fallback__restart-btn" onClick={restartApp}>
        Restart Application
      </button>

      {/* <span className={`fallback__toggle-icon ${isStackVisible ? 'open' : ''}`}>▼</span> */}
      {isStackVisible && (
        <div className="fallback__body">
          <p className="fallback__toggle" onClick={toggleStackVisibility}>
            <span>{isStackVisible ? 'Hide Error Trace' : 'Show Error Trace'}</span>
          </p>
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

export function TypingIndicator() {
  return (
    <>
      <style jsx>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color:rgb(42, 85, 69);
          border-radius: 50%;
          margin: 0 2px;
          animation: blink 1.4s infinite;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </>
  );
}
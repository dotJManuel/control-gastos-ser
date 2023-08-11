import React from 'react';

const ResponseMessage = ({ children, tipo }) => {
  return (
    <div className={`floating-message ${tipo === 'success' ? "success-message" : "error-message"}`}>
      <p>{children}</p>
    </div>
  );
};

export default ResponseMessage;

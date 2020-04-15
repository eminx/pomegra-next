import React from 'react';

function Anchor({ label, children, ...otherProps }) {
  return (
    <span {...otherProps}>
      <span>{label} </span>
      <a
        {...otherProps}
        href="#"
        style={{
          color: '#108ee9',
          borderBottom: '1px solid #108ee9',
        }}
      >
        {children}
      </a>
    </span>
  );
}

export default Anchor;

import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

const CustomScrollbars = ({ children, rtl = false, style }) => {
  const thumbStyle = {
    backgroundColor: '#888',
    borderRadius: '3px',
    width: '10px',
  };
  return (
    <Scrollbars
      renderView={(props) => (
        <div
          {...props}
          style={{
            ...props.style,
            marginLeft: rtl ? props.style.marginRight : 0,
            marginRight: rtl ? 0 : props.style.marginRight,
          }}
        />
      )}
      renderTrackHorizontal={(props) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: 10,
            position: 'absolute',
            borderRadius: '3px',
            width: '100%',
            bottom: '2px',
          }}
        />
      )}
      renderTrackVertical={(props) => (
        <div
          {...props}
          style={{
            ...props.style,
            left: rtl ? 2 : 'auto',
            right: rtl ? 'auto' : 2,
            bottom: 2,
            top: 2,
            borderRadius: 3,
            width: 10,
          }}
        />
      )}
      style={style}
      rtl={rtl}
    >
      {children}
    </Scrollbars>
  );
};

export default CustomScrollbars;

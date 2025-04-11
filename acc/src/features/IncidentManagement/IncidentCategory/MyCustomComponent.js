// MyCustomInput.js
import React from 'react';

const MyCustomInput = (props) => {
  const { data, onChange } = props;

  return (
    <div className="custom-input">
      <label>{data.label}</label>
      <input
        type="text"
        value={data.defaultValue || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default MyCustomInput;

import React from 'react';

const CustomFormElementsEdit = (props) => {
  const { element, updateElement } = props;

  return (
    <div>
      {/* Add your custom edit form fields here */}
      {element.element === 'CustomElement' && (
        <div>
          <label>
            Required:
            <input
              type="checkbox"
              checked={element.isRequired || false}
              onChange={(e) =>
                updateElement({ ...element, isRequired: e.target.checked })
              }
            />
          </label>
          <label>
            Label:
            <input
              type="text"
              value={element.label || ''}
              onChange={(e) =>
                updateElement({ ...element, label: e.target.value })
              }
            />
          </label>
          <label>
            Rows:
            <input
              type="number"
              value={element.rows || 3}
              onChange={(e) =>
                updateElement({
                  ...element,
                  rows: parseInt(e.target.value, 10),
                })
              }
            />
          </label>
          <label>
            Columns:
            <input
              type="number"
              value={element.cols || 3}
              onChange={(e) =>
                updateElement({
                  ...element,
                  cols: parseInt(e.target.value, 10),
                })
              }
            />
          </label>
          <div>
            {Array.from({ length: element.cols || 3 }).map((_, index) => (
              <div key={index}>
                <label>
                  Header {index + 1}:
                  <input
                    type="text"
                    value={
                      element.headers
                        ? element.headers[index]
                        : `Header ${index + 1}`
                    }
                    onChange={(e) => {
                      const newHeaders = [...(element.headers || [])];
                      newHeaders[index] = e.target.value;
                      updateElement({ ...element, headers: newHeaders });
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomFormElementsEdit;

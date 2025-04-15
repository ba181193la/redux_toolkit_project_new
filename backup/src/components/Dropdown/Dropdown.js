import React, { useRef, useState } from 'react';
import { MenuItem, Select } from '@mui/material';
import DropdownIcon from '../../assets/Icons/downArrow.png';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { StyledImage } from '../../utils/StyledComponents';
import useWindowDimension from '../../hooks/useWindowDimension';
const Dropdown = ({
  name,
  options = [],
  width = '100%',
  height,
  onChange,
  value,
  disabled = false,
  placeholder,
}) => {
  const { setFieldValue, values } = useFormikContext() || {};
  const { isMobile } = useWindowDimension();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef(null);
  const handleChange = (event) => {
    if (setFieldValue) setFieldValue(name, event.target.value);
    if (onChange) {
      onChange(event);
    }
  };
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };
  const handleIconClick = () => {
    setOpen((prev) => !prev);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Select
      value={values?.[name] || value || ''}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      onChange={handleChange}
      displayEmpty
      disabled={disabled}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      renderValue={(selected) => {
        if (selected === '') {
          return (
            <span
              style={{
                color: 'gray',
                fontSize: isMobile ? '13px' : '13px',
                justifyContent: 'start',
              }}
            >
              {placeholder || 'Select'}
            </span>
          );
        }
        const selectedOption = options.find(
          (option) => option.value?.toString() === selected.toString()
        );
        return selectedOption?.text || '';
      }}
      sx={{
        height: isMobile ? 30 : height || 32,
        width: width || '100%',
        display: 'flex',
        '& .MuiSelect-select': {
          padding: '0 50px',
          fontSize: isMobile ? '12px' : '12px',
          color: values?.[name] || value ? 'inherit' : 'gray',
          cursor: disabled ? 'not-allowed' : 'auto',
          display: 'flex',
        },
        '& .MuiSelect-icon': {
          display: 'none',
        },
        '& .MuiInputBase-input ': {
          paddingLeft: '1rem',
        },
      }}
      IconComponent={() => (
        <StyledImage
          src={DropdownIcon}
          alt="Dropdown Icon"
          onClick={!disabled ? handleIconClick : undefined}
          style={{
            fontSize: isMobile ? '24px' : '29px',
            paddingInlineEnd: '15px',
            cursor: 'pointer',
          }}
        />
      )}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: isMobile ? 200 : 300,
            width: isMobile ? '50%' : 'auto',
          },
        },
      }}
    >
      {options.map((item) => (
        <MenuItem
          key={item.value}
          value={item.value}
          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          sx={{
            whiteSpace: 'normal',
            minHeight: '30px',
            fontSize: '13px',
          }}
        >
          {item.text || item.value}
        </MenuItem>
      ))}
    </Select>
  );
};
export default Dropdown;

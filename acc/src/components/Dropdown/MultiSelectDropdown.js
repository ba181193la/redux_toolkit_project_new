import React, { useState, useRef, useEffect } from 'react';
import {
  MenuItem,
  Select,
  Checkbox,
  TextField,
  InputAdornment,
} from '@mui/material';
import DropdownIcon from '../../assets/Icons/downArrow.png';
import { useFormikContext } from 'formik';
import { FlexContainer, StyledImage } from '../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import SearchIcon from '../../assets/Icons/Search.png';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultiSelectDropdown = ({
  name,
  options = [],
  width = '100%',
  height,
  disabled = false,
  setSelectedIds = () => {},
  valueType = 'number',
  validateForm,
}) => {
  const { setFieldValue, values } = useFormikContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { i18n } = useTranslation();

  const value =
    typeof values[name] === 'string'
      ? values[name]
          .split(',')
          .map((val) => (valueType === 'string' ? val : Number(val)))
          .filter((val) => val !== 0 && !Number.isNaN(val))
      : Array.isArray(values[name])
        ? values[name]
            .map((val) => (valueType === 'string' ? val : Number(val)))
            .filter((val) => val !== 0 && !Number.isNaN(val))
        : [];

  const isSelectAllChecked = value.length === options.length;

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const handleChange = (event) => {
    const selectedValues = event.target.value;

    if (selectedValues.includes('Select All')) {
      if (isSelectAllChecked) {
        setFieldValue(name, []);
        setSelectedIds([]);
      } else {
        const optionValues = options.map((option) => option.value);
        setFieldValue(name, optionValues);
        setSelectedIds(optionValues);
      }
    } else {
      setFieldValue(name, selectedValues);
      setSelectedIds(selectedValues);
    }

    if (validateForm) {
      setTimeout(() => validateForm(), 100);
    }
  };
   
  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredOptions(
      options.filter((option) =>
        option.text.toLowerCase().includes(searchValue)
      )
    );
  };

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleIconClick = (event) => {
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  return (
    <FlexContainer style={{ width }}>
      <Select
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        multiple
        value={value.length > 0 ? value : []}
        onChange={handleChange}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        disabled={disabled}
        displayEmpty
        renderValue={(selected) => {
          if (selected.length === 0) {
            return (
              <span
                style={{
                  color: 'gray',
                  fontSize: '12px',
                }}
              >
                None Selected
              </span>
            );
          }

          const selectedTexts = selected.map((selectedValue) => {
            const option = options.find((opt) => opt.value === selectedValue);
            return option ? option.text : '';
          });

          return (
            <span
              style={{
                width: width || '100%',
                fontSize: '12px',
              }}
            >
              {selectedTexts.filter((item) => item).join(', ')}
            </span>
          );
        }}
        IconComponent={() => (
          <StyledImage
            src={DropdownIcon}
            alt="Dropdown Icon"
            style={{ fontSize: '29px', padding: '15px', cursor: 'pointer' }}
            onClick={handleIconClick}
          />
        )}
        MenuProps={MenuProps}
        disableCloseOnSelect // Prevents dropdown from closing
        sx={{
          height: height || 32,
          width: '100%',
          display: 'flex',
          '& .MuiSelect-select': {
            padding: '0 25px',
            fontSize: '16px',
            display: 'flex',
          },
          '& .MuiSelect-icon': {
            display: 'none',
          },
        }}
      >
        <MenuItem
          disableRipple
          style={{
            height: '40px',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: 0,
          }}
        >
          <TextField
            size="medium"
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            placeholder="Type to search..."
            value={searchTerm}
            fullWidth={true}
            onChange={handleSearchChange}
            inputRef={searchInputRef}
            onKeyDown={(e) => {
              if (e.key !== 'Escape') {
                e.stopPropagation();
              }
            }}
            onFocus={() => setOpen(true)} // Keeps the dropdown open
            sx={{
              width: '100%',
              height: '30px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                height: '35px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img
                    src={SearchIcon}
                    alt="Search Icon"
                    style={{ width: '20px', height: '20px' }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </MenuItem>
        <MenuItem
          value="Select All"
          style={{ height: '40px', fontSize: '13px' }}
          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        >
          <Checkbox checked={isSelectAllChecked} size="small" />
          Select All
        </MenuItem>
        {filteredOptions.length === 0 ? (
  <MenuItem disabled style={{ height: '40px', fontSize: '13px', color: 'gray' }}>
    No Data Available
  </MenuItem>
) : (
  filteredOptions.map((option) => (
    <MenuItem
      key={option.value}
      value={option.value}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      style={{ height: '40px', fontSize: '13px' }}
    >
      <Checkbox checked={value.includes(option.value)} size="small" />
      {option.text}
    </MenuItem>
  ))
)}
      </Select>
    </FlexContainer>
  );
};

export default MultiSelectDropdown;

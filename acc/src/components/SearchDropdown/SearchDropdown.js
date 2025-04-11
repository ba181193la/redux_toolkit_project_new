import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '../../assets/Icons/Search.png';
import { width } from '@mui/system';

const SearchDropdown = ({
  name,
  options,
  onChange,
  value,
  disabled = false,
  width
}) => {
  const { i18n } = useTranslation();
  
  return (
    <Autocomplete
      disabled={disabled}
      disableClearable
      name={name}
      options={options}
      getOptionLabel={(option) => option.text}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Select"
          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          InputProps={{
            ...params.InputProps,
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
      )}
      renderOption={(props, option) => (
        <li {...props} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          {option.text}
        </li>
      )}
      value={value}
      sx={{
        width :width?width: "100%",
        '& .MuiInputBase-root': {
          height: '32px',
          cursor: 'pointer',
        },
        '& .MuiInputBase-input::placeholder': {
          fontSize: '12px',
          fontFamily: 'Lato',
          color: 'gray',
          opacity: 1,
        },
        '& .MuiInputBase-input': {
          fontSize: '12px',
        },
      }}
    />
  );
};

export default SearchDropdown;

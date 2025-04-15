import React from 'react';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../utils/StyledComponents';
import DeleteIcon from '../../assets/Icons/ImageUploadDelete.png';

export default function ImageUpload({
  name,
  imagetext,
  imagebutton,
  onChange,
  value,
  onDelete,
  ...props
}) {
  const handleFileChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };
  return (
    <>
      <FlexContainer
        height="160px"
        justifyContent="center"
        alignItems="center"
        border="1px solid #C5C5C5"
        borderRadius="4px 4px 0px 0px"
        backgroundColor="white"
        opacity={1}
        flexDirection="column"
        position="relative"
        overflow="hidden"
      >
        <StyledImage
          src={DeleteIcon}
          alt="Delete Icon"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            cursor: 'pointer',
            width: '20px',
            height: '20px',
            zIndex: 1,
          }}
          onClick={handleDeleteClick}
        />
        {value ? (
          <StyledImage
            height={'100%'}
            width={'100%'}
            src={value}
            alt="Uploaded file preview"
          />
        ) : (
          <StyledTypography
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            textAlign="center"
            color="#0083C0"
          >
            {imagetext}
          </StyledTypography>
        )}

        <input
          type="file"
          name={name}
          onChange={handleFileChange}
          style={{
            opacity: 0,
            cursor: 'pointer',
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
          {...props}
        />
      </FlexContainer>

      <StyledTypography
        textTransform="none"
        padding="6px 10px"
        alignItems="center"
        justifyContent="center"
        backgroundColor="#0F6CBD"
        color="#FFFFFF"
        fontSize="14px"
        fontWeight="500"
        lineHeight="20px"
        borderRadius="0px 0px 4px 4px"
        textAlign="center"
        height="32px"
      >
        {imagebutton || 'Upload'}
      </StyledTypography>
    </>
  );
}

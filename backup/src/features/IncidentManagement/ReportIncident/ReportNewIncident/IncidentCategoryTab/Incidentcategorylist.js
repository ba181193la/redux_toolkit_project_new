import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  FormLabel,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { Formik, useFormikContext } from 'formik';
import React from 'react';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import Dropdown from '../../../../../components/Dropdown/Dropdown';
 
import { useSelector } from 'react-redux';
import IncidentcategorylistTable from './IncidentcategorylistTable';
import CloseIcon from '../../../../../assets/Icons/CloseIcon.png';
import AffectedCategory from '../Modal/AffectedCategory';
function Incidentcategorylist({
  isIncidentCategoryModel,
  handleSelectRow,
  handleClose,
  pageloadData,
}) {
  const { setFieldValue } = useFormikContext();
  const [searchQuery, setSearchQuery] = useState('');
  // affectedCategoryId: 1,
  //   affectedCategory: 'PATIENT',
  const [selectedAffectedCategory, setSelectedAffectedCategory] = useState('');
  const [AffectedCategoryName, setAffectedCategoryName] = useState({
    id: '',
    name: '',
  });
  const [AffectedCategoryCode, setAffectedCategoryCode] = useState({
    id: '',
    name: '',
  });
  const regionCode = useSelector((state) =>
    state.auth.regionCode?.toUpperCase()
  );
  const handleABDSelectRow = (incident) => {
    setFieldValue('mainCategoryId', incident.MainCategoryId);
    setFieldValue('mainCategory', incident?.MainCategory);
    setFieldValue('mainCategoryCode', incident.MainCategoryCode || '');
    setFieldValue('subCategoryId', incident.SubCategoryId);
    setFieldValue('subCategory', incident.SubCategory || '');
    setFieldValue('subCategoryCode', incident?.SubCategoryCode);
    setFieldValue('incidentDetailId', incident.IncidentDetailId);
    setFieldValue('incidentDetails', incident.IncidentDetail || '');
    setFieldValue('incidentDetailsCode', incident?.IncidentDetailCode);
    handleClose();
  };
 
  return (
    <>
      {regionCode === 'ABD' ? (
        <Dialog
          open={isIncidentCategoryModel}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: '900px',
              maxWidth: 'none',
              borderRadius: '8px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
            },
          }}
        >
          <Box>
            <DialogTitle
              sx={{
                backgroundColor: '#205475',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                height: 40,
                alignItems: 'center',
                padding: '0 8px',
              }}
            >
              <StyledTypography
                fontSize="18px"
                fontWeight="300"
                lineHeight="18px"
                padding="0 12px"
                color="#fff"
              >
                Category Detail List
              </StyledTypography>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: '#fff',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                    backgroundColor: 'rgba(15, 108, 189, 0.2)',
                  },
                }}
              >
                <Tooltip title="Close" arrow>
                  <StyledImage
                    src={CloseIcon}
                    alt="Close Icon"
                    tooltip="Close"
                  />
                </Tooltip>
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ border: '4px solid #205475' }}>
              <Formik
                initialValues={{ selectedAffectedCategory: '' }} // Ensure default exists
                onSubmit={(values) => console.log('Form Values:', values)}
              >
                {({ values, setFieldValue }) => (
                  <Box>
                    <FlexContainer
                      padding="20px 20px 20px 0"
                      alignItems="center"
                    >
                      <FlexContainer width="50%" gap="0px" alignItems="center">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                          }}
                        >
                          <Box sx={{ width: '40%' }}>
                            <FormLabel>Affected Category</FormLabel>
                            <Dropdown
                              options={[
                                { value: '', text: 'Select' }, // Default option
                                ...(pageloadData?.Data?.AffectedcategoryList?.map(
                                  (item) => ({
                                    value: item.AffectedCategoryId,
                                    text: item.AffectedCategory,
                                  })
                                ) || []),
                              ]}
                              value={values.selectedAffectedCategory}
                              onChange={(event) => {
                                const selectedValue =
                                  event?.target?.value || event?.value;
                                const selectedCategory =
                                  pageloadData?.Data?.AffectedcategoryList?.find(
                                    (item) =>
                                      item.AffectedCategoryId === selectedValue
                                  );
 
                                setFieldValue(
                                  'selectedAffectedCategory',
                                  selectedValue || ''
                                );
                                setSelectedAffectedCategory(
                                  selectedValue || ''
                                );
                                setAffectedCategoryName({
                                  id: selectedValue || '',
                                  name:
                                    selectedCategory?.AffectedCategory || '',
                                });
                                setAffectedCategoryCode({
                                  id: selectedValue || '',
                                  name:
                                    selectedCategory?.AffectedCategoryCode ||
                                    '',
                                });
                              }}
                            />
                          </Box>
 
                          <Box sx={{ width: '60%' }}>
                            <FormLabel>Search Category</FormLabel>
                            <TextField
                              fullWidth
                              placeholder="Search Category..."
                              value={searchQuery}
                              onChange={(event) =>
                                setSearchQuery(event.target.value)
                              }
                            />
                          </Box>
                        </Box>
                      </FlexContainer>
                    </FlexContainer>
 
                    <AffectedCategory
                      staffFetching={false}
                      selectedCategory={selectedAffectedCategory}
                      searchQuery={searchQuery}
                      onSelectRow={handleABDSelectRow}
                    />
                  </Box>
                )}
              </Formik>
            </DialogContent>
          </Box>
        </Dialog>
      ) : (
        <Dialog
          open={isIncidentCategoryModel}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: '900px',
              maxWidth: 'none',
              borderRadius: '8px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
            },
          }}
        >
          <Box>
            <DialogTitle
              sx={{
                backgroundColor: '#205475',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                height: 40,
                alignItems: 'center',
                padding: '0 8px',
              }}
            >
              <StyledTypography
                fontSize="18px"
                fontWeight="300"
                lineHeight="18px"
                padding="0 12px"
                color="#fff"
              >
                Category Detail List 3333333
              </StyledTypography>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: '#fff',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                    backgroundColor: 'rgba(15, 108, 189, 0.2)',
                  },
                }}
              >
                <Tooltip title="Close" arrow>
                  <StyledImage
                    src={CloseIcon}
                    alt="Close Icon"
                    tooltip="Close"
                  />
                </Tooltip>
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ border: '4px solid #205475' }}>
              <Formik>
                <Box
                  sx={{
                    marginBottom: 2,
                    display: 'block',
                    alignItems: 'center',
                  }}
                >
                  <FlexContainer padding="20px 20px 20px 0" alignItems="center">
                    <FlexContainer width="50%" gap="0px" alignItems="center">
                      <Box sx={{ padding: '0 0 0 20px', width: '60%' }}></Box>
                    </FlexContainer>
                  </FlexContainer>
                  <IncidentcategorylistTable
                    data={[]}
                    columns={[]}
                    staffFetching={false}
                    isEdit={false}
                    labels={{}}
                    totalRecords={0}
                    setIsStaffModel={() => {}}
                    setSelectedFacilityId={null}
                    selectedFacilityId={null}
                    setStaffFacilityId={null}
                    onSelectRow={handleSelectRow}
                  />
                </Box>
              </Formik>
            </DialogContent>
          </Box>
        </Dialog>
      )}
    </>
 
    // <Dialog
    //   open={isIncidentCategoryModel}
    //   onClose={handleClose}
    //   PaperProps={{
    //     sx: {
    //       width: '900px',
    //       maxWidth: 'none',
    //       borderRadius: '8px',
    //       boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    //     },
    //   }}
    // >
    //   <Box>
    //     <DialogTitle
    //       sx={{
    //         backgroundColor: '#205475',
    //         color: '#fff',
    //         display: 'flex',
    //         justifyContent: 'space-between',
    //         height: 40,
    //         alignItems: 'center',
    //         padding: '0 8px',
    //       }}
    //     >
    //       <StyledTypography
    //         fontSize="18px"
    //         fontWeight="300"
    //         lineHeight="18px"
    //         padding="0 12px"
    //         color="#fff"
    //       >
    //         Category Detail List
    //       </StyledTypography>
    //       <IconButton
    //         onClick={handleClose}
    //         sx={{
    //           color: '#fff',
    //           '&:hover': {
    //             transform: 'scale(1.05)',
    //             transition: 'transform 0.3s ease',
    //             backgroundColor: 'rgba(15, 108, 189, 0.2)',
    //           },
    //         }}
    //       >
    //         <Tooltip title="Close" arrow>
    //           <StyledImage src={CloseIcon} alt="Close Icon" tooltip="Close" />
    //         </Tooltip>
    //       </IconButton>
    //     </DialogTitle>
    //     <DialogContent sx={{ border: '4px solid #205475' }}>
    //       <Box
    //         sx={{
    //           marginBottom: 2,
    //           display: 'block',
    //           alignItems: 'center',
    //         }}
    //       >
    //         <FlexContainer padding="20px 20px 20px 0" alignItems="center">
    //           <FlexContainer width="50%" gap="0px" alignItems="center">
    //             <Box sx={{ padding: '0 0 0 20px', width: '60%' }}></Box>
    //           </FlexContainer>
    //         </FlexContainer>
    //         <IncidentcategorylistTable
    //           data={[]}
    //           columns={[]}
    //           staffFetching={false}
    //           isEdit={false}
    //           labels={{}}
    //           totalRecords={0}
    //           setIsStaffModel={() => {}}
    //           setSelectedFacilityId={null}
    //           selectedFacilityId={null}
    //           setStaffFacilityId={null}
    //           onSelectRow={handleSelectRow}
    //         />
    //       </Box>
    //     </DialogContent>
    //   </Box>
    // </Dialog>
  );
}
 
export default Incidentcategorylist;
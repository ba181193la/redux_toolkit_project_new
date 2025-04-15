import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    Grid,
    TextField,
    Autocomplete,
    TextareaAutosize,
    TableContainer,
    Table,
    TableRow,
    Paper,
    TableBody,
    Box,
  } from '@mui/material';
  
  import {
    FlexContainer,
    StyledButton,
    StyledImage,
    StyledTypography,
  } from '../../../../utils/StyledComponents';
  import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
  import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
  import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
  import SaveIcon from '../../../../assets/Icons/SaveIcon.png';
  import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
  import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
  import { useTranslation } from 'react-i18next';
  import { Formik, Form, Field, ErrorMessage } from 'formik';
  import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
  import Label from '../../../../components/Label/Label';
  import { useEffect, useState } from 'react';
  import * as Yup from 'yup';
  import { getlabel } from '../../../../utils/language';
  import { useGetFieldsQuery } from '../../../../redux/RTK/moduleDataApi';
  import { useSelector } from 'react-redux';
  import {
    useAddReferenceNumberMutation,
    useGetReferenceNumberDataByIdQuery,
  } from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
  import { showToastAlert } from '../../../../utils/SweetAlert';
  import TextArea from '../../../../components/TextArea/TextArea';
  import { bgcolor, height } from '@mui/system';
  import {
    StyledTableBodyCell,
    StyledTableHeaderCell,
    StyledTableRow,
    StyledTableHead,
  } from '../../../../utils/DataTable.styled';
  import Scrollbars from 'react-custom-scrollbars-2';
  
  const AddEditIncidentSearchDataAccess = ({ incidentSearchDataAccessList, setIncidentSearchDataAccessList }) => {
    //* Hooks declaration
    const { t, i18n } = useTranslation();
  
    const [fieldLabels, setFieldLabels] = useState([]);
  
    //* Selectors
    const { selectedMenu, selectedModuleId, userDetails } = useSelector(
      (state) => state.auth
    );
    const [newHarmLevel, setNewHarmLevel] = useState({
      harmLevelId: 0,
      facility: '',
      harmLevel: '',
      definition: '',
      notificationStaff: '',
    });
  
    //* Close modal
    const handleOnCancel = () => {
      setNewHarmLevel({
        harmLevelId: 0,
        facility: '',
        harmLevel: '',
        definition: '',
        notificationStaff: '',
      });
      // setSelectedReferenceNumberId(null);
      setIncidentSearchDataAccessList(false);
    };
  
    const { data: fieldAccess = [] } = useGetFieldsQuery({
      menuId: selectedMenu?.id,
      moduleId: 2,
      // moduleId: selectedModuleId,
    });
    //* Field access checking
    const fields = fieldAccess?.Data?.Sections?.find(
      (section) => section?.SectionName === 'Page'
    )?.Regions;
  
    const pageFields = fields?.find(
      (region) => region?.RegionCode === 'ALL'
    )?.Fields;
  
    return (
      <Dialog
        open={incidentSearchDataAccessList}
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        maxWidth={'sm'}
        fullWidth={true}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#205475',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
          }}
        >
          <StyledTypography
            fontSize="20px"
            fontWeight="300"
            lineHeight="18px"
            color="#fff"
          >
            {t('HarmLevel')}
          </StyledTypography>
          <IconButton
            onClick={handleOnCancel}
            style={{
              padding: '0.7rem',
            }}
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: 'color(srgb 0.75 0.74 0.74 / 0.15)',
              },
            }}
          >
            <Tooltip title="Close" arrow>
              <StyledImage src={CloseIcon} alt="Close Icon" />
            </Tooltip>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FlexContainer flexWrap="wrap">
            <Formik
              enableReinitialize={true}
              initialValues={newHarmLevel}
              validateOnBlur={false}
              //   validationSchema={referenceNumberValidation}
              //   onSubmit={(values) => submitReferenceNumber(values)}
            >
              {({ values, setFieldValue }) => (
                <Form style={{ width: '100%' }}>
                  <Grid
                    container
                    display={'flex'}
                    width="100%"
                    flexWrap={'wrap'}
                    justifyContent={'space-between'}
                    item
                    xs={12}
                    spacing={2}
                    alignItems={'center'}
                    marginTop={'1rem'}
                  >
                    {pageFields?.find((x) => x.FieldId === 'IS_IRN_P_Facility')
                      ?.IsShow && (
                      <Grid
                        container
                        display={'flex'}
                        width="100%"
                        flexWrap={'wrap'}
                        justifyContent={'space-between'}
                        item
                        xs={12}
                        spacing={2}
                        alignItems={'center'}
                      >
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                          <Label
                            value="Facility"
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_IRN_P_Facility'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <Autocomplete
                            disableClearable={true}
                            name={'incDateFormat'}
                            // options={[
                            //   { text: 'Select', value: '' },
                            //   ...(dateFormatList || []),
                            // ]}
                            getOptionLabel={(option) => option.text}
                            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                            sx={{
                              '& .MuiAutocomplete-inputRoot': {
                                fontSize: '13px',
                                height: '100%',
                              },
                              '& .MuiOutlinedInput-root': {
                                height: '34px',
                                '& .MuiAutocomplete-input': {
                                  height: '34px',
                                  fontSize: '13px',
                                },
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Select"
                              />
                            )}
                            ListboxProps={{
                              sx: {
                                '& .MuiAutocomplete-option': {
                                  fontSize: '13px',
                                  minHeight: '30px',
                                  display: 'flex',
                                  alignItems: 'center',
                                },
                              },
                            }}
                            // value={
                            //   dateFormatList?.find(
                            //     (option) =>
                            //       option.value === values['incDateFormat']
                            //   ) || null
                            // }
                            onChange={(event, value) => {
                              setFieldValue('incDateFormat', value?.value);
                            }}
                          />
                          <ErrorMessage
                            name="facility"
                            component="div"
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}
                    {pageFields?.find(
                      (x) => x.FieldId === 'IS_IRN_P_IncidentReferenceNumber'
                    )?.IsShow && (
                      <Grid
                        container
                        display={'flex'}
                        width="100%"
                        flexWrap={'wrap'}
                        justifyContent={'space-between'}
                        item
                        xs={12}
                        spacing={2}
                        alignItems={'center'}
                      >
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                          <Label
                            value="Harm Level"
                            isRequired={
                              pageFields?.find(
                                (x) =>
                                  x.FieldId === 'IS_IRN_P_IncidentReferenceNumber'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <Field name="incRefNumber">
                            {({ field }) => (
                              <TextField
                                {...field}
                                id="incRefNumber"
                                autoComplete="off"
                                values={values.incRefNumber}
                                fullWidth={true}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                                // disabled={isFetching}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="incRefNumber"
                            component="div"
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}
                    {pageFields?.find(
                      (x) => x.FieldId === 'IS_IRN_P_IncidentDateFormat'
                    )?.IsShow && (
                      <Grid
                        container
                        display={'flex'}
                        width="100%"
                        flexWrap={'wrap'}
                        justifyContent={'space-between'}
                        item
                        xs={12}
                        spacing={2}
                      >
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                          <Label
                            value="Definition"
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_IRN_P_IncidentDateFormat'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <TextArea name="Definition" />
                          <ErrorMessage
                            name="incDateFormat"
                            component="div"
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}
                    <Grid
                      display={'flex'}
                      width="100%"
                      justifyContent={'center'}
                      gap={'10px'}
                      marginTop={'2rem'}
                    >
                      <StyledButton
                        borderRadius="6px"
                        gap="4px"
                        padding="6px 10px"
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{ display: 'inline-flex', gap: '5px' }}
                        //disabled={isAdding || isUpdating}
                        startIcon={
                          <StyledImage
                            height="16px"
                            width="16px"
                            src={DoneIcon}
                            alt="WhiteSearch"
                          />
                        }
                      >
                        {t('Submit')}
                      </StyledButton>
                      <StyledButton
                        variant="outlined"
                        border="1px solid #0083c0"
                        backgroundColor="#ffffff"
                        type="button"
                        colour="#0083c0"
                        borderRadius="6px"
                        sx={{ marginLeft: '10px' }}
                        //disabled={isAdding || isUpdating}
                        style={{ display: 'inline-flex', gap: '5px' }}
                        onClick={handleOnCancel}
                        startIcon={
                          <StyledImage
                            height="16px"
                            width="16px"
                            src={DndIcon}
                            alt="WhiteSearch"
                          />
                        }
                      >
                        {t('Cancel')}
                      </StyledButton>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </FlexContainer>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default AddEditIncidentSearchDataAccess;
  
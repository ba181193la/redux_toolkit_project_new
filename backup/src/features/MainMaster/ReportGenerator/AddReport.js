import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  TableContainer,
  TableHead,
  Table,
  TableCell,
  TableBody,
  TableRow,
  Paper
} from '@mui/material';

import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';

import { Formik, Form, ErrorMessage, useFormikContext } from 'formik';

import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';

import Label from '../../../components/Label/Label';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getlabel } from '../../../utils/language';
import { useTranslation } from 'react-i18next';
import Search from '../../../assets/Icons/Search.png';
import {
  useGetAllFacilityQuery,
  useGetModuleListQuery,
  useGetAllMenuListQuery,
  useAddReportMutation,
  useUpdateReportMutation,
  useGetReportByIdQuery,
} from '../../../redux/RTK/reportGeneratorApi';
import DoNotDisturbIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import { showToastAlert } from '../../../utils/SweetAlert';
import NotifyuserModal from './NotifyUserModal';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import * as Yup from 'yup';

const AddReport = ({
  isAddModal,
  isEditModal,
  isViewModal,
  setIsViewOnly,
  fieldAccess,
  labels,
  SelectedReportId,
  viewOnly,
  isEditOnly,
  onClose,
  setMatchingStaffNames,
  matchingStaffNames,
}) => {
  const { i18n, t } = useTranslation();
  const [isNotifyUserModalOpen, setNotifyUserModalOpen] = useState(false);
  const [facilityId, setFacilityId] = useState('');
  const [modalFacilityId, setModalFacilityId] = useState('');
  const [triggerAddReport] = useAddReportMutation();
  const [triggerUpdateReport] = useUpdateReportMutation();
  const [notifiedUserId, setNotifiedUserId] = useState(null);
  const [notifiedUsers, setNotifiedUsers] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredMenuList, setFilteredMenuList] = useState([]);
  const [modalFacilityValue, setModalfacilityValue] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
   const [selectedUserIds, setSelectedUserIds] = useState([]);
   const [selectedRows, setSelectedRows] = useState([]);
  const { userDetails, selectedFacility, menuDetails, selectedModuleId } = useSelector(
    (state) => state.auth
  );
  const [imselectedModuleId, setImselectedModuleId] = useState(null);

  const { data: ReportData, refetch: refetchReportData } =
    useGetReportByIdQuery(
      {
        ReportGeneratorId: SelectedReportId,
        LoginUserId: userDetails?.UserId,
        PageModuleId: 1,
        PageMenuId: 17,
      },
      { skip: !SelectedReportId }
    );

  const [initialValues, setInitialValues] = useState({
    facility: '',
    moduleName: '',
    menuName: '',
    frequency: '',
    reportingDate: '',
    notifyUsers: '',
  });

  useEffect(() => {
    if ((isViewModal || isEditModal || viewOnly) && ReportData && ReportData.Data && ReportData.Data.length > 0) {
      setInitialValues({
        facility: ReportData.Data[0].FacilityId || '',
        moduleName: ReportData.Data[0].ModuleId || '',
        menuName: ReportData.Data[0].MenuName || '',
        frequency: ReportData.Data[0].Frequency || '',
        reportingDate: ReportData.Data[0].ReportingDate || '',
        notifyUsers: ReportData.Data[0].NotifyUsersNames || '',
      });
      // setModalfacilityValue(modalFacilityValue)
    }
  }, [ReportData, isEditModal, isViewModal, viewOnly ]);

  const { data: getFacility = [] } = useGetAllFacilityQuery({
    payload: {
      pageIndex: 1,
      pageSize: 100,
      headerFacility: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: 1,
      menuId: 17,
    },
  });

  const { data: getModuleList = [] } = useGetModuleListQuery({
    payload: {
      loginUserId: userDetails?.UserId,
      moduleId: 1,
      menuId: 17,
    },
  });

  const pageFields = fieldAccess?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  let reportGeneratorValidation;

  try {
    reportGeneratorValidation = Yup.object().shape({
      facility: Yup.string().when([], {
        is: () =>
          pageFields?.find((x) => x.FieldId === 'RG_P_Facility')
            ?.IsMandatory === true,
        then: (schema) =>
          schema.required(
            `${getlabel('MM_RG_Facility', labels, i18n.language)} ${t('IsRequired')}`
          ),
        otherwise: (schema) => schema.notRequired(),
      }),

      moduleName: Yup.string().when([], {
        is: () =>
          pageFields?.find((x) => x.FieldId === 'RG_P_ModuleName')
            ?.IsMandatory === true,
        then: (schema) =>
          schema.required(
            `${getlabel('MM_RG_ModuleName', labels, i18n.language)} ${t('IsRequired')}`
          ),
        otherwise: (schema) => schema.notRequired(),
      }),

      menuName: Yup.string().when([], {
        is: () =>
          pageFields?.find((x) => x.FieldId === 'RG_P_Frequency')
            ?.IsMandatory === true,
        then: (schema) =>
          schema.required(
            `${getlabel('MM_RG_Frequency', labels, i18n.language)} ${t('IsRequired')}`
          ),
        otherwise: (schema) => schema.notRequired(),
      }),

      frequency: Yup.string().when([], {
        is: () =>
          pageFields?.find((x) => x.FieldId === 'RG_P_Frequency')
            ?.IsMandatory === true,
        then: (schema) =>
          schema.required(
            `${getlabel('MM_RG_Frequency', labels, i18n.language)} ${t('IsRequired')}`
          ),
        otherwise: (schema) => schema.notRequired(),
      }),

      reportingDate: Yup.string().when([], {
        is: () =>
          pageFields?.find((x) => x.FieldId === 'RG_P_ReportDate')
            ?.IsMandatory === true,
        then: (schema) =>
          schema.required(
            `${getlabel('RG_P_ReportDate', labels, i18n.language)} ${t('IsRequired')}`
          ),
        otherwise: (schema) => schema.notRequired(),
      }),
    });
  } catch (error) {
    alert('ValidatingError');
    console.error('Error creating Yup validation schema:', error);
  }

  const Frequencies = [
    { text: 'Monthly', value: 'monthly' },
    { text: 'Daily', value: 'daily' },
  ];
  const daysOptions = Array.from({ length: 31 }, (v, k) => ({
    text: `${k + 1}`,
    value: k + 1,
  }));

  const { data: getMenuList = [] } = useGetAllMenuListQuery({
    payload: {
      loginUserId: userDetails?.UserId,
      moduleId: imselectedModuleId,
      menuId: 17,
    },
  });

  const handleSearchIconClick = () => {
    if (!isEditModal) {
      setModalFacilityId(''); 
    }
    setNotifyUserModalOpen(true);
  };

  const handleFacilityChange = (selectedFacilityId) => {
    setFacilityId(selectedFacilityId);
  };

  const resetFields = () => {
    setModalFacilityId('');
    // setSearchQuery('');
    setSelectedUsers([]);
    setSelectedUserIds([]);
  };

  const handleSubmit = async ({ values }, resetForm) => {
    setLoading(true);
    const moduleId = values?.moduleName === 1 ? 1 : 2;
    const moduleName = moduleId === 1 ? 'MainMaster' : 'Incident Management';
    const matchingMenus =
      getMenuList?.records?.filter((menu) => {
        return menu.MenuId === values?.menuName;
      }) || [];
    const selectedMenu = matchingMenus[0];
    if (!selectedMenu) {
      console.error('ERROR: Selected menu not found in getMenuList.records!');
    } else {
      console.log('Selected Menu:', selectedMenu);
    }
    const selectedMenuId = selectedMenu ? selectedMenu.MenuId : null;
    const selectedMenuName = selectedMenu ? selectedMenu.MenuName : null;

    let response;

    try {
      if (SelectedReportId) {
        response = await triggerUpdateReport({
          payload: {
            reportGeneratorId: SelectedReportId,
            facilityId: ReportData?.Data[0]?.FacilityId,
            moduleId: ReportData?.Data[0]?.ModuleId,
            menuId: ReportData?.Data[0]?.MenuId,
            frequency: values?.frequency,
            reportingDate: values?.reportingDate,
            notifyUsers: notifiedUserId,
            createdBy: 0,
            createdDate: '2024-10-15T11:44:55.898Z',
            modifiedBy: 0,
            modifiedDate: '2024-10-15T11:44:55.898Z',
            pageModuleId: 1,
            pageMenuId: 17,
            loginUserId: 2,
            facilityName: values?.facility,
            userFacilityId: modalFacilityId,
            moduleName: ReportData?.Data[0]?.ModuleName,
            menuName: ReportData?.Data[0]?.MenuName,
          },
        });
      } else {
        response = await triggerAddReport({
          payload: {
            facilityId,
            moduleId,
            menuId: selectedMenuId,
            frequency: values?.frequency,
            reportingDate: values?.reportingDate,
            notifyUsers: notifiedUserId,
            isDelete: true,
            pageModuleId: 1,
            pageMenuId: 17,
            loginUserId: 2,
            facilityName: getFacility?.records?.[0]?.FacilityName,
            userFacilityId: modalFacilityId,
            moduleName: moduleName,
            menuName: selectedMenuName,
          },
        });
      }


      if (!response) {
      } else {
      }

      if (response) {
        if (response?.data?.Message !== 'Record Already Exist') {
          showToastAlert({
            type: 'custom_success',
            text: response?.data?.Message,
            gif: 'SuccessGif',
          });
        } else {
          showToastAlert({
            type: 'custom_info',
            text: response?.data?.Message,
            gif: 'InfoGif',
          });
        }
      }
    } catch (error) {
      showToastAlert({
        type: 'error',
        text: 'An unexpected error occurred. Please try again later.',
      });
    }
    setLoading(false);
    setMatchingStaffNames([]);
    resetForm();
    resetFields();
    setSelectedUsers([]);
    setSelectedUserIds([]);
    setSelectedRows([]);
    onClose();
    refetchReportData();
  };

  // const handleModuleChange = (e) => {
  //   const selectedMenuList = menuDetails?.filter((menu) => {
  //     return e.target.value === menu?.ParentMenuId;
  //   });
  // };
  // const handleModuleChange = (e, setFieldValue) => {
  //   const selectedModuleId = e.target.value;

  //   // Filter the menu list based on the selected module
  //   const selectedMenuList = menuDetails?.filter((menu) => {
  //     return Number(menu?.ModuleId) === selectedModuleId;
  //   });



  //   // Update Formik values and state
  //   setFieldValue('moduleName', selectedModuleId); // Update module selection
  //   setFilteredMenuList(selectedMenuList); // Store filtered menu options
  //   setFieldValue('menuName', ''); // Reset menu selection when module changes
  // };

  const handleModuleChange = (e, setFieldValue) => {
    const moduleId = e.target.value;
  
    // Update state with selected module
    setImselectedModuleId(moduleId);
  
    // Filter the menu list based on selected module
    const selectedMenuList = menuDetails?.filter((menu) => {
      return Number(menu?.ModuleId) === Number(moduleId);
    });
  
  
    // Update Formik values and state
    setFieldValue('moduleName', moduleId); 
    setFilteredMenuList(selectedMenuList); // Store filtered menu options
    setFieldValue('menuName', ''); // Reset menu selection when module changes
  };

  useEffect(() => {
    if (isEditModal) {
      setInitialValues((prev) => ({
        ...prev,
        notifyUsers: matchingStaffNames || '',  // Ensure notifyUsers updates
      }));
    }
  }, [matchingStaffNames, isEditModal]);

  return (
    <>
      <Dialog
        open={isAddModal || isEditModal || isViewModal }
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
            {t('ReportGenerator')}
          </StyledTypography>
          <IconButton
            onClick={() => {
              if (isEditModal || viewOnly || isViewModal) {
                setInitialValues({});
                setIsViewOnly(false);
                setModalfacilityValue("")
              }
              onClose();
            }}
            style={{ padding: '0.7rem' }}
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: 'color(srgb 0.75 0.74 0.74 / 0.15)',
              },
            }}
          >
            <StyledImage src={CloseIcon} alt="Close Icon" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FlexContainer flexWrap="wrap">
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={reportGeneratorValidation}
              validateOnBlur={true}
              onSubmit={(values, { resetForm }) =>
                handleSubmit({ values }, resetForm)
              }
            >
              {({
                values,
                resetForm,
                submitForm,
                setFieldValue,
                errors,
                touched,
              }) => {
                useEffect(() => {
                  if (isAddModal) {
                    setInitialValues({});
                  }
                }, [isAddModal]);
                return (
                  <Form style={{ width: '100%' }}>
                    {pageFields?.find((x) => x.FieldId === 'RG_P_Facility')
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
                        marginTop={'1rem'}
                      >
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={4}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_RG_Facility',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'RG_P_Facility'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={8}
                          padding={'10px'}
                        >
                          {(viewOnly || isEditModal) ? (
                            <Label value={
                              getFacility?.records?.find((f) => f.FacilityId === values.facility)
                                ?.FacilityDetail || '-'
                            } />
                          ) : (
                            // <Dropdown
                            //   name="facility"
                            //   fullWidth={true}
                            //   onChange={(e) =>
                            //     handleFacilityChange(e.target.value)
                            //   }
                            //   disabled={isEditModal}
                            //   options={getFacility?.records?.map((facility) => ({
                            //     text: facility.FacilityName,
                            //     value: facility.FacilityId,
                            //   }))}
                            // />
                            <SearchDropdown
                              disableClearable={true}
                              name="facility"
                              options={[
                                { text: 'Select', value: '' },
                                ...(getFacility?.records?.map((facility) => ({
                                  text: facility.FacilityDetail,
                                  value: facility.FacilityId,
                                })) || []),
                              ]}
                              disabled={isEditModal}
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
                              onChange={(event, value) => {
                                setFieldValue('facility', value?.value);
                                if (value?.value) {
                                  handleFacilityChange(value?.value);
                                } else {
                                  handleFacilityChange(null); // Optional if you want to reset on clear
                                }
                              }}
                              value={
                                getFacility?.records
                                  ?.map((facility) => ({
                                    text: facility.FacilityDetail,
                                    value: facility.FacilityId,
                                  }))
                                  .find(
                                    (option) =>
                                      option.value === values['facility']
                                  ) || null
                              }
                            />
                          )}

                          {/* <ErrorMessage
                            name="facility"
                            component="div"
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          /> */}
                          {errors.facility && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.facility}
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}

                    {pageFields?.find((x) => x.FieldId === 'RG_P_ModuleName')
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
                        marginTop={'0.2rem'}
                      >
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={4}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_RG_ModuleName',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'RG_P_ModuleName'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={8}
                          padding={'10px'}
                        >
                          {(viewOnly || isEditModal)? (
                            <Label value={
                              getModuleList?.records?.find((m) => m.ModuleId === values.moduleName)
                                ?.ModuleName || '-'
                            } />
                          ) : (
                            <Dropdown
                              name="moduleName"
                              disabled={isEditModal}
                              options={getModuleList?.records?.map(
                                (Modules) => ({
                                  text: Modules.ModuleName,
                                  value: Modules.ModuleId,
                                })
                              )}
                              // onChange={handleModuleChange}
                              onChange={(e) =>
                                handleModuleChange(e, setFieldValue)
                              }
                              value={initialValues?.moduleName}
                              fullWidth={true}
                            />
//                             <SearchDropdown
//   disableClearable={true}
//   disabled={isEditModal}
//   name="moduleName"
//   options={[
//     { text: 'Select', value: '' },
//     ...(getModuleList?.records?.map((Modules) => ({
//       text: Modules.ModuleName,
//       value: Modules.ModuleId,
//     })) || []),
//   ]}
//   getOptionLabel={(option) => option.text}
//   dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
//   sx={{
//     '& .MuiAutocomplete-inputRoot': {
//       fontSize: '13px',
//       height: '100%',
//     },
//     '& .MuiOutlinedInput-root': {
//       height: '34px',
//       '& .MuiAutocomplete-input': {
//         height: '34px',
//         fontSize: '13px',
//       },
//     },
//   }}
//   renderInput={(params) => (
//     <TextField {...params} variant="outlined" placeholder="Select" />
//   )}
//   ListboxProps={{
//     sx: {
//       '& .MuiAutocomplete-option': {
//         fontSize: '13px',
//         minHeight: '30px',
//         display: 'flex',
//         alignItems: 'center',
//       },
//     },
//   }}
//   value={
//     getModuleList?.records
//       ?.map((Modules) => ({
//         text: Modules.ModuleName,
//         value: Modules.ModuleId,
//       }))
//       .find((option) => option.value === values?.moduleName) || null
//   }
//   onChange={(e) =>
//     handleModuleChange(e, setFieldValue)
//   }
// />


                          )}

                          {errors.moduleName && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.moduleName}
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}
                    {pageFields?.find((x) => x.FieldId === 'RG_P_PageName')
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
                        marginTop={'0.2rem'}
                      >
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={4}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_RG_MenuName',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'RG_P_menuName'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={8}
                          padding={'10px'}
                        >
                          {(viewOnly || isEditModal) ?(
                            <Label value={values?.menuName} />
                          ) : (
                            // <Dropdown
                            //   id="menuName"
                            //   name="menuName"
                            //   value={values?.menuName}
                            //   disabled={isEditModal}
                            //   options={getMenuList?.records?.map((Menus) => ({
                            //     text: Menus.MenuName,
                            //     value: Menus.MenuId,
                            //   }))}
                            //   fullWidth={true}
                            // />
                            //                           <Dropdown
                            //   id="menuName"
                            //   name="menuName"
                            //   value={values?.menuName}
                            //   disabled={isEditModal} // Disable if no module is selected
                            //   options={filteredMenuList?.map((Menus) => ({
                            //     text: Menus.MenuName,
                            //     value: Menus.MenuId,
                            //   }))}
                            //   fullWidth={true}
                            // />

                            <SearchDropdown
                              disableClearable={true}
                              disabled={
                                isEditModal || filteredMenuList?.length === 0
                              } // Disable if edit mode or no menu options available
                              name="menuName"
                              options={[
                                { text: 'Select', value: '' },
                                ... filteredMenuList
                                ?.filter((menu) => menu.ParentMenuId !== null && menu.MenuId !== 1) // Apply filtering
                                .map((menu) => ({
                                  text: menu.MenuName,
                                  value: menu.MenuId,
                                })) || []
                              ]}
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
                              value={
                                filteredMenuList
                                  ?.map((Menus) => ({
                                    text: Menus.MenuName,
                                    value: Menus.MenuId,
                                  }))
                                  .find(
                                    (option) =>
                                      option.value === values?.menuName
                                  ) || null
                              }
                              onChange={(event, value) => {
                                setFieldValue('menuName', value?.value || ''); // Ensure value is never undefined
                              }}
                            />
                          )}

                          {errors.menuName && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.menuName}
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}

                    {pageFields?.find((x) => x.FieldId === 'RG_P_Frequency')
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
                        marginTop={'0.2rem'}
                      >
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={4}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_RG_Frequency',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'RG_P_Frequency'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={8}
                          padding={'10px'}
                        >
                          {viewOnly ? (
                            <Label value={values.frequency} />
                          ) : (
                            // <Dropdown
                            //   name="frequency"
                            //   options={Frequencies.map((frequency) => ({
                            //     text: frequency.text,
                            //     value: frequency.value,
                            //   }))}
                            //   value={values?.frequency}
                            //   fullWidth={true}
                            // />
                            <SearchDropdown
                              disableClearable={true}
                              name="frequency"
                              options={[
                                { text: 'Select', value: '' },
                                ...(Frequencies?.map((frequency) => ({
                                  text: frequency.text,
                                  value: frequency.value,
                                })) || []),
                              ]}
                              getOptionLabel={(option) => option?.text || ''} // Handle undefined values safely
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
                              value={
                                Frequencies?.find(
                                  (option) => option.value === values?.frequency
                                ) || null
                              }
                              onChange={(event, value) => {
                                setFieldValue('frequency', value?.value || ''); // Ensure empty string instead of undefined
                              }}
                            />
                          )}

                          {errors.frequency && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.frequency}
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}

                    {pageFields?.find((x) => x.FieldId === 'RG_P_ReportDate')
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
                        marginTop={'0.2rem'}
                      >
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={4}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_RG_ReportDate',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'RG_P_ReportDate'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={8}
                          padding={'10px'}
                        >
                          {viewOnly ? (
                            <Label value={values.reportingDate} />
                          ) : (
                            <Dropdown
                              name="reportingDate"
                              options={daysOptions}
                              value={values?.reportingDate}
                              fullWidth={true}
                            />
                          )}

                          {errors.reportingDate && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.reportingDate}
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}

                    {pageFields?.find((x) => x.FieldId === 'RG_P_NotifyUsers')
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
                        marginTop={'0.2rem'}
                      >
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={4}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_RG_NotifyUsers',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'RG_P_NotifyUsers'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={8}
                          padding={'10px'}
                        >
                          {viewOnly ? (
                            // <Label value={values.notifyUsers} />
                            <TableContainer component={Paper} sx={{ maxHeight: 200, overflow: 'auto' }}>
                            <Table size="small" stickyHeader style={{ borderCollapse: 'collapse' }}>
                              <TableHead >
                                <TableRow >
                                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#205475', color: "#FFFFFF" }}>User Name</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {/* Convert values.notifyUsers into an array */}
                                {values.notifyUsers ? (
                                  values.notifyUsers
                                    .split(',') // If it's a comma-separated string
                                    .map((userName, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{userName.trim() || '-'}</TableCell>
                                      </TableRow>
                                    ))
                                ) : (
                                  <TableRow>
                                    <TableCell align="center">No users found</TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          ) : isEditOnly ? (
                            <TextField
                              name="notifyUsers"
                              // value={ReportData?.NotifyUsersNames || ''}
                              value={
                                values?.notifyUsers || matchingStaffNames || ''
                              }
                              fullWidth={true}
                              InputProps={{
                                readOnly: true,
                                style: { color: 'transparent', textShadow: 'none' },
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <StyledImage
                                      src={Search}
                                      alt="Search Icon"
                                      onClick={handleSearchIconClick}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          ) : (
                            <TextField
                              name="notifyUsers"
                              autoComplete="off"
                              // value={}
                              value={
                                values?.notifyUsers || matchingStaffNames || ''
                              }
                              // value={matchingStaffNames}
                              fullWidth={true}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <StyledImage
                                      src={Search}
                                      alt="Search Icon"
                                      onClick={handleSearchIconClick}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}

{errors.notifyUsers && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.notifyUsers}
                            </div>
                          )}
                        </Grid>
                      </Grid>
                    )}

{!viewOnly && (  // Hide buttons in view mode
  <Grid
    display={'flex'}
    width="100%"
    justifyContent={'center'}
    gap={'10px'}
    marginTop={'1rem'}
  >
    <StyledButton
      borderRadius="6px"
      gap="4px"
      padding="6px 10px"
      variant="contained"
      color="primary"
      type="submit"
      style={{ display: 'inline-flex', gap: '5px' }}
      startIcon={
        <StyledImage
          height="16px"
          width="16px"
          src={DoneIcon}
          alt="WhiteSearch"
        />
      }
    >
      {loading ? t('Submitting...') : t('Submit')}
    </StyledButton>

    <StyledButton
      variant="outlined"
      border="1px solid #0083c0"
      backgroundColor="#ffffff"
      type="button"
      colour="#0083c0"
      borderRadius="6px"
      sx={{ marginLeft: '10px' }}
      style={{ display: 'inline-flex', gap: '5px' }}
      // onClick={() => {
      //   resetForm();
      //   setInitialValues({});
      //   setFieldValue('notifyUsers', '');
      // }}
      onClick={() => {
        if (isAddModal) {
          setInitialValues({
            facility: '',
            moduleName: '',
            menuName: '',
            frequency: '',
            reportingDate: '',
            notifyUsers: '',
          });
          resetFields();
        } else {
          onClose(); // Close only in Edit mode
        }
      }}
      
      startIcon={
        <StyledImage
          height="16px"
          width="16px"
          src={DoNotDisturbIcon}
          alt="WhiteSearch"
        />
      }
    >
      {t('Cancel')}
    </StyledButton>
  </Grid>
)}

                  </Form>
                );
              }}
            </Formik>
          </FlexContainer>
        </DialogContent>
      </Dialog>

      <NotifyuserModal
        open={isNotifyUserModalOpen}
        onClose={setNotifyUserModalOpen}
        modalFacilityId={modalFacilityId}
        modalFacilityValue={modalFacilityValue}
        setModalfacilityValue={setModalfacilityValue}
        setModalFacilityId={setModalFacilityId}
        labels={labels}
        ReportData={ReportData}
        notifiedUserId={notifiedUserId}
        SelectedReportId={SelectedReportId}
        setNotifiedUserId={setNotifiedUserId}
        notifiedUsers={notifiedUsers}
        setNotifiedUsers={setNotifiedUsers}
        setMatchingStaffNames={setMatchingStaffNames}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        isEditModal={isEditModal}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        setSelectedUserIds={setSelectedUserIds}
        selectedUserIds={selectedUserIds}
        isAddModal={isAddModal}
      />
    </>
  );
};

export default AddReport;

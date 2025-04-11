import React, { useEffect, useState } from 'react';
import { Divider, Grid, InputAdornment, Tooltip } from '@mui/material';
import BackArrowGif from '../../../../assets/Gifs/BackArrowGif.gif';
import {
  CommonStyledButton,
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import Label from '../../../../components/Label/Label';
import { TextField } from '../../../../components/TextField/TextField';
import { useTranslation } from 'react-i18next';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import Search from '../../../../assets/Icons/Search.png';
import { useNavigate, useParams } from 'react-router-dom';
import DataTable from './DataTable';
import AssignRoles from './AssignRolesPopup';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetLabelsQuery,
  useGetFieldsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import EmployeeNameModel from './EmployeeNameModel';
import {
  useGetAddUserMutation,
  useGetAllFacilitiesQuery,
  useGetUserAssignmentByIdQuery,
  useGetUserPageLoadDataQuery,
  useLazyGetUserAssignmentByIdQuery,
} from '../../../../redux/RTK/userAssignmentApi';
import { getlabel } from '../../../../utils/language';
import i18n from '../../../../i18n/i18n';
import { setUserAssignmentList } from '../../../../redux/features/mainMaster/userAssignmentSlice';
import { showToastAlert } from '../../../../utils/SweetAlert';
import { StyledContainer } from '../../NotificationMaster/NotificationMasterTable';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';

const newUserAssignmentColumns = [
  { id: 'assignedApplicationRoles', translationId: 'MM_UA_ApplicationRole' },
  {
    id: 'assignedFacilites',
    translationId: 'MM_UA_Facility',
  },
];

const pagesConfigData = [
  {
    fieldId: 'UA_P_StaffName',
    translationId: 'MM_UA_StaffName',
    component: 'TextField',
    name: 'StaffName',
  },
  {
    fieldId: 'UA_P_EmployeeID',
    translationId: 'MM_UA_EmployeeID',
    component: 'TextField',
    name: 'EmployeeID',
  },
  {
    fieldId: 'UA_P_DepartmentUnit',
    translationId: 'MM_UA_Department',
    component: 'TextField',
    name: 'DepartmentName',
  },
  {
    fieldId: 'UA_P_Designation',
    translationId: 'MM_UA_Designation',
    component: 'TextField',
    name: 'DesignationName',
  },
  {
    fieldId: 'UA_P_Status',
    translationId: 'MM_UA_Status',
    component: 'TextField',
    name: 'Status',
  },
];

const AddUser = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [selectedRowData, setSelectedRowData] = useState(null);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEmployeeModel, setIsEmployeeModel] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedEditRow, setSelectedEditRow] = useState({});
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const { isMobile } = useWindowDimension();

  const {
    selectedMenu,
    selectedModuleId,
    selectedFacility,
    userDetails,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);
  const userAssignmentList = useSelector(
    (state) => state.userAssignment.userAssignmentList
  );

  const [initialValues, setInitialValues] = useState({
    StaffName: userAssignmentData?.Data?.UserName || '',
    EmployeeID: userAssignmentData?.Data?.EmployeeID || '',
    DepartmentName: userAssignmentData?.Data?.DepartmentName || '',
    DesignationName: userAssignmentData?.Data?.DesignationName || '',
    Status: userAssignmentData?.Data?.Status || '',
  });

  const [validationSchema, setValidationSchema] = useState();
  useEffect(() => {
    const schemaFields = {};
    pageFields?.forEach((field) => {
      if (field.IsShow && field.IsMandatory) {
        const fieldConfig = pagesConfigData?.find(
          (config) => config.fieldId === field.FieldId
        );
        const translatedLabel = getlabel(
          fieldConfig?.translationId,
          labels,
          i18n.language
        );

        switch (fieldConfig?.name) {
          case 'StaffName':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'EmployeeID':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'DepartmentName':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'DesignationName':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;

          case 'Status':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          default:
            break;
        }
      }
    });
    setValidationSchema(Yup.object().shape(schemaFields));
  }, [pageFields]);

  const {
    data: userAssignmentData,
    isFetching: isUserFetching,
    refetch: refetchUserAssignmentById,
  } = useGetUserAssignmentByIdQuery(
    {
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      userId: id,
    },
    { skip: !id }
  );

  const [triggerGetAddUser] = useGetAddUserMutation();
  const [triggerGetUserAssignment] = useLazyGetUserAssignmentByIdQuery();
  const { data: pageLoadData } = useGetUserPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const { data: allFacilities = [] } = useGetAllFacilitiesQuery({
    payload: {
      pageIndex: 1,
      pageSize: 50,
      headerFacility: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    },
  });
  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const handleAssignRoles = () => {
    setOpen(true);
  };

  const handleEmployeeModel = () => {
    setIsEmployeeModel(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditModal(false);
  };

  const handleEmployeModelClose = () => {
    setIsEmployeeModel(false);
    setSelectedFacilityId('');
  };

  useEffect(() => {
    if (selectedRowData || userAssignmentData) {
      setInitialValues(() => ({
        StaffName:
          (id
            ? userAssignmentData?.Data?.UserName
            : selectedRowData?.StaffName) || '',
        EmployeeID:
          (id
            ? userAssignmentData?.Data?.EmployeeID
            : selectedRowData?.EmployeeId) || '',
        DepartmentName:
          (id
            ? userAssignmentData?.Data?.DepartmentName
            : selectedRowData?.Department) || '',
        DesignationName:
          (id
            ? userAssignmentData?.Data?.DesignationName
            : selectedRowData?.PrimaryDesignation) || '',
        Status:
          (id ? userAssignmentData?.Data?.Status : selectedRowData?.Status) ||
          '',
      }));
    }
  }, [selectedRowData, userAssignmentData]);

  const updatedFacilities =
    userDetails?.ApplicableFacilities?.filter((facility) => {
      if (!facility.IsActive) return false;
      if (isSuperAdmin) return true;
      const facilityItem = roleFacilities
        ?.find((role) => role.FacilityId === facility.FacilityId)
        ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
      return facilityItem?.IsAdd;
    }).map((facility) => ({
      FacilityName: facility.FacilityName,
      FacilityId: facility.FacilityId,
    })) || [];
  // userDetails?.ApplicableFacilities?.filter((facility) => {
  //     return facility.FacilityName !== 'All';
  //   }) || [];

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section.SectionName === 'Page'
  )?.Fields;

  useEffect(() => {
    const mapAssignedRoles = (data) => {
      return data?.Data?.Roles.map((role) => {
        const additionalFacilityId = role.Facilities.map(
          (facility) => facility.FacilityId
        );

        return {
          additionalFacilityId: additionalFacilityId?.join(','),
          isDelete: 0,
          roleId: role.RoleId,
        };
      });
    };
    const mapAssignedRolesData = mapAssignedRoles(userAssignmentData) || [];
    dispatch(setUserAssignmentList([...mapAssignedRolesData]));
  }, [userAssignmentData]);

  const getUserAssignment = async () => {
    const response = await triggerGetUserAssignment({
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      userId: selectedRowData?.UserId,
    });
    if (response.data?.Data) {
      const mapAssignedRoles = (data) => {
        return response.data?.Data?.Roles.map((role) => {
          const additionalFacilityId = role.Facilities.map(
            (facility) => facility.FacilityId
          );

          return {
            additionalFacilityId: additionalFacilityId?.join(','),
            isDelete: 0,
            roleId: role.RoleId,
          };
        });
      };
      const mapAssignedRolesData = mapAssignedRoles(userAssignmentData) || [];
      dispatch(setUserAssignmentList([...mapAssignedRolesData]));
    }
  };
  useEffect(() => {
    if (id) {
      refetchUserAssignmentById();
    }
    if (selectedRowData?.UserId) {
      getUserAssignment();
    }
  }, [id, selectedRowData]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async () => {
        if (!userAssignmentList || userAssignmentList.length === 0) {
          showToastAlert({
            type: 'custom_error',
            text: 'Please assign at least one role before submitting.',
            gif: 'ErrorGif',
          });
          return;
        }

        let response;
        try {
          response = await triggerGetAddUser({
            payload: {
              userId: id ? id : selectedRowData?.UserId,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              loginUserId: userDetails?.UserId,
              roleList: userAssignmentList,
            },
          }).unwrap();

          if (response) {
            if (response.Message === 'Record Already Exist') {
              showToastAlert({
                type: 'custom_info',
                text: response.Message,
                gif: 'InfoGif',
              });
            } else {
              const successMessage = id
                ? response.Message
                : 'Record Added Successfully';
              showToastAlert({
                type: 'custom_success',
                text: successMessage,
                gif: 'SuccessGif',
              });
              navigate('/MainMaster/UserAssignment');
            }
          }
        } catch (error) {
          showToastAlert({
            type: 'custom_error',
            text: 'Something Went Wrong!',
            gif: 'InfoGif',
          });
        } finally {
          refetchUserAssignmentById();
          dispatch(setUserAssignmentList([]));
        }
      }}
    >
      {({ errors, resetForm, setValues, setFieldError, isSubmitting }) => {
        useEffect(() => {
          if (userAssignmentData || selectedRowData) {
            setValues({
              ...initialValues,
              StaffName:
                (id
                  ? userAssignmentData?.Data?.UserName
                  : selectedRowData.StaffName) || '',
              DesignationName:
                (id
                  ? userAssignmentData?.Data?.DesignationName
                  : selectedRowData.PrimaryDesignation) || '',
              EmployeeID:
                (id
                  ? userAssignmentData?.Data?.EmployeeID
                  : selectedRowData.EmployeeId) || '',
              DepartmentName:
                (id
                  ? userAssignmentData?.Data?.DepartmentName
                  : selectedRowData.Department) || '',
              Status:
                (id
                  ? userAssignmentData?.Data?.Status
                  : selectedRowData.Status) || '',
            });
            Object.keys(errors).forEach((key) => {
              setFieldError(key, undefined);
            });
          }
        }, [selectedRowData, userAssignmentData, setValues, setFieldError]);

        return (
          <Form>
            <FlexContainer width="100%" height="100%" flexDirection="column">
              <FlexContainer
                marginBottom={'30px'}
                marginTop={'65px'}
                style={{ paddingBottom: '15px' }}
              >
                <StyledTypography
                  fontSize={isMobile ? '24px' : '36px'}
                  fontWeight="900"
                  lineHeight={isMobile ? '32px' : '44px'}
                  color="#0083C0"
                  whiteSpace={'nowrap'}
                >
                  {t('MM_UserAssignment')}
                </StyledTypography>
              </FlexContainer>

              <FlexContainer
                width="calc(100% - 30px)"
                height="auto"
                flex="1"
                flexDirection="column"
              >
                <FlexContainer
                  height="100%"
                  width="100%"
                  padding={isMobile ? '10px' : '15px 15px 0'}
                  borderRadius="8px"
                  flexDirection="column"
                  backgroundColor="#fff"
                >
                  <FlexContainer alignItems="center">
                    <FlexContainer>
                      <Tooltip title="Go back" arrow>
                        <button
                          style={{
                            backgroundColor: 'rgb(52 152 219)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '8px 16px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '10px',
                            display: 'block',
                            fontSize: '13px',
                          }}
                          onClick={() => {
                            navigate('/MainMaster/UserAssignment');
                            dispatch(setUserAssignmentList([]));
                          }}
                        >
                          <span
                            style={{ marginRight: '4px', fontSize: '12px' }}
                          >{`<<`}</span>{' '}
                          Previous
                        </button>
                      </Tooltip>
                    </FlexContainer>

                    <StyledTypography
                      fontSize={isMobile ? '16px' : '20px'}
                      fontWeight="600"
                      lineHeight={isMobile ? '20px' : '24px'}
                      textAlign="left"
                      color="#205475"
                    >
                      {id ? t('UpdateUser') : t('AddUser')}
                    </StyledTypography>
                  </FlexContainer>
                  <Divider sx={{ marginY: '20px' }} />

                  {isUserFetching || isLabelsFetching || isFieldsFetching ? (
                    <FlexContainer justifyContent="center">
                      <StyledImage src={LoadingGif} alt="LoadingGif" />
                    </FlexContainer>
                  ) : (
                    <>
                      <Grid container spacing={2} display={'flex'}>
                        {pageFields?.map((field) => {
                          const fieldConfig = pagesConfigData.find(
                            (config) => config.fieldId === field.FieldId
                          );
                          if (field.IsShow && fieldConfig) {
                            const translatedLabel = getlabel(
                              fieldConfig?.translationId,
                              labels,
                              i18n.language
                            );
                            return (
                              <Grid item xs={12} sm={4} padding={'10px'}>
                                <Label
                                  value={translatedLabel}
                                  isRequired={field.IsMandatory}
                                />
                                {fieldConfig.name === 'StaffName' ? (
                                  <TextField
                                    name={fieldConfig.name}
                                    value={
                                      (id
                                        ? userAssignmentData?.Data?.UserName
                                        : selectedRowData?.StaffName) || ''
                                    }
                                    InputProps={{
                                      readOnly: true,
                                      endAdornment: (
                                        <InputAdornment position="start">
                                          <StyledImage
                                            src={Search}
                                            alt="Search Icon"
                                            cursor={
                                              id ? 'not-allowed' : 'pointer'
                                            }
                                            onClick={
                                              id
                                                ? undefined
                                                : handleEmployeeModel
                                            }
                                            style={{ opacity: id ? 0.5 : 1 }}
                                          />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                ) : (
                                  <TextField
                                    name={fieldConfig.name}
                                    value={
                                      id
                                        ? userAssignmentData?.Data?.[
                                            fieldConfig.name
                                          ]
                                        : fieldConfig.name === 'DesignationName'
                                          ? selectedRowData?.PrimaryDesignation
                                          : fieldConfig.name === 'EmployeeID'
                                            ? selectedRowData?.EmployeeId
                                            : fieldConfig.name ===
                                                'DepartmentName'
                                              ? selectedRowData?.Department
                                              : selectedRowData?.[
                                                  fieldConfig.name
                                                ] || ''
                                    }
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                )}

                                {errors[fieldConfig.name] && (
                                  <FlexContainer
                                    style={{ color: 'red', fontSize: '11px' }}
                                  >
                                    {errors[fieldConfig.name]}
                                  </FlexContainer>
                                )}
                              </Grid>
                            );
                          }
                        })}
                      </Grid>
                      <StyledContainer width="100%">
                        <Grid
                          container
                          justifyContent="flex-end"
                          sx={{ padding: '0 0 8px 0' }}
                        >
                          <StyledButton
                            onClick={handleAssignRoles}
                            variant="contained"
                            gap="8px"
                            style={{
                              width: isMobile ? '100%' : 'auto',
                            }}
                            startIcon={
                              <StyledImage
                                height="14px"
                                width="14px"
                                src={AddSubMaster}
                                alt="Add New Icon"
                              />
                            }
                          >
                            {t('AssignRoles')}
                          </StyledButton>
                        </Grid>

                        <DataTable
                          setIsEditModal={setIsEditModal}
                          setSelectedEditRow={setSelectedEditRow}
                          columns={newUserAssignmentColumns}
                          labels={labels}
                          pageLoadData={pageLoadData?.Data}
                          setAssignedRoles={setAssignedRoles}
                        />
                      </StyledContainer>
                    </>
                  )}
                  <FlexContainer
                    justifyContent="end"
                    padding="10px 320px 0px 0"
                    gap="10px"
                  >
                    <AssignRoles
                      open={open || isEditModal}
                      isEditModal={isEditModal}
                      setIsEditModal={setIsEditModal}
                      selectedEditRow={selectedEditRow}
                      onClose={() => handleClose()}
                      pageLoadData={pageLoadData}
                      setAssignedRoles={setAssignedRoles}
                      assignedRoles={assignedRoles}
                    />
                  </FlexContainer>
                </FlexContainer>
                <FlexContainer
                  gap="16px"
                  justifyContent="center"
                  padding="50px 15px 40px 0px"
                  flexDirection={isMobile ? 'column' : 'row'}
                >
                  <CommonStyledButton
                    type="submit"
                    variant="contained"
                    text-color="#0083C0"
                    onSubmit={() => onSubmit(resetForm)}
                    gap="8px"
                    startIcon={
                      <StyledImage
                        src={DoneIcon}
                        sx={{
                          marginBottom: '1px',
                          color: '#FFFFFF',
                        }}
                      />
                    }
                  >
                    <StyledTypography marginTop="1px" color="#FFFFFF">
                      {isSubmitting
                        ? id
                          ? t('Updating')
                          : t('Submitting...')
                        : id
                          ? t('Update')
                          : t('Submit')}
                    </StyledTypography>
                  </CommonStyledButton>
                  <CommonStyledButton
                    variant="outlined"
                    gap="8px"
                    onClick={() => {
                      navigate('/MainMaster/UserAssignment');
                      dispatch(setUserAssignmentList([]));
                    }}
                    startIcon={<StyledImage src={DoNotDisturbIcon} />}
                  >
                    <StyledTypography marginTop="1px">
                      {t('Cancel')}
                    </StyledTypography>
                  </CommonStyledButton>
                </FlexContainer>
              </FlexContainer>
              <EmployeeNameModel
                open={isEmployeeModel}
                onClose={handleEmployeModelClose}
                pageLoadData={pageLoadData}
                allFacilities={updatedFacilities}
                setSelectedRowData={setSelectedRowData}
                selectedRowData={selectedRowData}
                setIsEmployeeModel={setIsEmployeeModel}
                selectedFacilityId={selectedFacilityId}
                setSelectedFacilityId={setSelectedFacilityId}
              />
            </FlexContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddUser;

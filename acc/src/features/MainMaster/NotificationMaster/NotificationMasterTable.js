import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import { styled } from 'styled-components';
import {
  CommonStyledButton,
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import AddSubMaster from '../../../assets/Icons/AddSubMaster.png';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import { getlabel } from '../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import DesignationTable from './DesignationTable';
import { useGetLabelsQuery } from '../../../redux/RTK/moduleDataApi';
import {
  useGetTemplateByTaskQuery,
  useUpdateNotificationMutation,
} from '../../../redux/RTK/notificationMasterApi';
import { useNavigate, useParams } from 'react-router-dom';
import StaffTable from './StaffTable';
import RoleTable from './RoleTable';
import AddDesignationModel from './AddDesignationModel';
import AddStaffModel from './AddStaffModel';
import EmailEditor from '../../../components/EmailEditor/EmailEditor';
import { useGetVariableDetailsQuery } from '../../../redux/RTK/notificationMasterApi';
import { Form, Formik } from 'formik';
import { useRef } from 'react';
import {
  setDesignationList,
  setRoleList,
  setStaffList,
} from '../../../redux/features/mainMaster/notificationMasterSlice';
import { showToastAlert } from '../../../utils/SweetAlert';
import VariableDataTable from './VariableDataTable';
import { useTranslation } from 'react-i18next';
import useWindowDimension from '../../../hooks/useWindowDimension';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';

const StyledHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  margin-bottom: 20px;
  gap: 4px; /* Adjust gap between rows if needed */
`;

const StyledLabel = styled(Typography)`
  text-align: left;
`;

const StyledValue = styled(Typography)`
  text-align: left;
`;

export const StyledContainer = styled.div`
  display: block !important;
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};
  width: ${(props) => props.width};
  gap: ${(props) => props.gap};
`;

const designationColumns = [
  {
    id: 'DesignationFacility',
    translationId: 'MM_NM_Facility',
    fieldId: 'NM_P_Facility',
    isSelected: true,
  },
  {
    id: 'DesignationName',
    translationId: 'MM_NM_Designation',
    fieldId: 'NM_P_Designation',
    isSelected: true,
  },
  {
    id: 'SenderType',
    translationId: 'MM_NM_SenderType',
    fieldId: 'NM_P_SenderType',
    isSelected: true,
  },
];

const staffColumns = [
  {
    id: 'StaffFacilityName',
    translationId: 'MM_NM_Facility',
    fieldId: 'NM_P_Facility',
    isSelected: true,
  },
  {
    id: 'StaffName',
    translationId: 'MM_NM_StaffName',
    fieldId: 'NM_P_StaffName',
    isSelected: true,
  },
  {
    id: 'SenderType',
    translationId: 'MM_NM_SenderType',
    fieldId: 'NM_P_SenderType',
    isSelected: true,
  },
  {
    id: 'Department',
    translationId: 'MM_NM_Department',
    fieldId: 'NM_P_Department',
    isSelected: true,
  },
];

const RoleColumns = [
  {
    id: 'RoleName',
    translationId: 'MM_NM_Role',
    fieldId: 'NM_P_Role',
    isSelected: true,
  },
  {
    id: 'SenderType',
    translationId: 'MM_NM_SenderType',
    fieldId: 'NM_P_SenderType',
    isSelected: true,
  },
];

const NotificationMasterTable = () => {
  const { id } = useParams();
  const { i18n, t } = useTranslation();
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();
  const { pageName, task, mailTaskId, designationList, roleList, staffList } =
    useSelector((state) => state.notificationMaster);
  const [isStaffModel, setIsStaffModel] = useState(false);
  const [isDesignationModel, setIsDesignationModel] = useState(false);
  const [error, setError] = useState('');
  const [designationFacilityId, setDesignationFacilityId] = useState('');
  const [staffFacilityId, setStaffFacilityId] = useState('');

  const handleDesignation = () => {
    setIsDesignationModel(true);
  };

  const handleStaff = () => {
    setIsStaffModel(true);
  };

  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    selectedRoleFacility,
  } = useSelector((state) => state.auth);

  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const { data: TemplatesByTask = [], isFetching: isTemplateFetching } =
    useGetTemplateByTaskQuery({
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
      loginUserId: userDetails?.UserId,
      mailTaskId: id,
    });

  const { data: VariableDetails = [], isFetching: isVariablesFetching } =
    useGetVariableDetailsQuery({
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
      loginUserId: userDetails?.UserId,
    });

  const columns = [
    {
      id: 'VariableName',
      translationId: 'MM_NM_PlaceHolders',
      fieldId: 'NM_P_Variables',
      isSelected: true,
    },
  ];

  useEffect(() => {
    const DesignationRecords = TemplatesByTask?.Data?.RecipientDetail?.filter(
      (recipient) => recipient.UserType === 'Designation'
    );

    const StaffRecords = TemplatesByTask?.Data?.RecipientDetail?.filter(
      (recipient) => recipient.UserType === 'Staff'
    );

    const RoleRecords = TemplatesByTask?.Data?.RecipientDetail?.filter(
      (recipient) => recipient.UserType === 'Role'
    );
    dispatch(setDesignationList(DesignationRecords));
    dispatch(setStaffList(StaffRecords));
    dispatch(setRoleList(RoleRecords));
  }, [TemplatesByTask]);

  const combinedCustomTemplates =
    TemplatesByTask?.Data?.TemplateDetail?.CustomTemplate;
  const cleanedCustomTemplates = combinedCustomTemplates?.replace(/^"|"$/g, '');
  const initialValues = {
    templateId: id || '',
    mailTaskId: mailTaskId || '',
    defaultTemplate:
      'Dear <<EmployeeId>>, your user profile password has been changed successfully..',
    customTemplate:
      combinedCustomTemplates ||
      '<p>This is the initial content of the editor.</p>',
    loginUserId: '',
    moduleId: '',
    menuId: '',
    userType: '',
    senderType: '',
    roleId: '',
    designationName: '',
    userId: '',
  };
  const [triggerUpdateNotification, {isLoading}] = useUpdateNotificationMutation();

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={async () => {
          const content = editorRef.current.getContent();
          const cleanedContent = content
            .replace(/\\n/g, '')
            .replace(/\\"/g, '"')
            .trim();

          if (cleanedContent === '' || cleanedContent.length === 0) {
            setError('Email template should not be empty.');
            return;
          }

          const wrappedHtmlContent = `"${cleanedContent}"`;
          const TemplateList = [...designationList, ...staffList, ...roleList];

          let response;
          if (id) {
            response = await triggerUpdateNotification({
              payload: {
                defaultFacilityId: selectedFacility?.id,
                templateId: TemplatesByTask?.Data?.TemplateDetail?.TemplateId,
                mailTaskId: mailTaskId,
                defaultTemplate:
                  'Dear <<EmployeeId>>, your user profile password has been changed successfully..',
                customTemplate: wrappedHtmlContent,
                loginUserId: userDetails?.UserId,
                moduleId: selectedModuleId,
                menuId: selectedMenu?.id,
                notificationMailRecipient: TemplateList?.map((template) => {
                  return {
                    mailTaskId: mailTaskId,
                    userType: template?.UserType || '',
                    senderType: template?.SenderType || '',
                    roleId: template?.RoleId || '',
                    designationName: template?.DesignationName || '',
                    DesignationId: template?.DesignationId || '',
                    userId: template?.UserId || '',
                    DesignationFacilityId:
                      template?.UserType === 'Designation'
                        ? designationFacilityId
                        : '',
                    StaffFacilityId:
                      template?.UserType === 'Staff' ? staffFacilityId : '',
                  };
                }),
              },
              skip:
                !mailTaskId ||
                !id ||
                !designationList?.some(
                  (designation) => designation?.UserType
                ) ||
                !designationList?.some(
                  (designation) => designation?.SenderType
                ) ||
                !selectedModuleId ||
                !selectedMenu?.Id ||
                wrappedHtmlContent,
            }).unwrap();
            if (response && response.Message !== 'Record Already Exist') {
              showToastAlert({
                type: 'custom_success',
                text: response.Message,
                gif: 'SuccessGif',
              });
            }
            if (response && response.Message === 'Record Already Exist') {
              showToastAlert({
                type: 'custom_info',
                text: response.Message,
                gif: 'InfoGif',
              });
            }

            navigate('/MainMaster/NotificationMaster');
          }
        }}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {() =>
          isLabelsFetching || isTemplateFetching || isVariablesFetching ? (
            <FlexContainer justifyContent="center">
              <StyledImage src={LoadingGif} alt="LoadingGif" />
            </FlexContainer>
          ) : (
            <Form>
              <StyledContainer>
                <StyledContainer
                  padding={isMobile ? '20px 15px' : '10px 15px'}
                  alignItems="center"
                  justifyContent={isMobile ? 'flex-start' : 'center'}
                >
                  <StyledHeaderContainer>
                    <Grid
                      container
                      spacing={isMobile ? 0.7 : 1}
                      alignItems="center"
                      direction="row"
                    >
                      <Grid item>
                        <StyledLabel>
                          <StyledTypography
                            fontSize={isMobile ? '12px' : '14px'}
                          >
                            {getlabel('MM_NM_PageName', labels, i18n.language)}
                          </StyledTypography>
                        </StyledLabel>
                      </Grid>
                      <Grid item>
                        <Typography fontSize={isMobile ? '12px' : '14px'}>
                          :
                        </Typography>
                      </Grid>
                      <Grid item>
                        <StyledValue>
                          <StyledTypography
                            fontSize={isMobile ? '12px' : '14px'}
                          >
                            {pageName}
                          </StyledTypography>
                        </StyledValue>
                      </Grid>
                      {!isMobile && (
                        <Grid item style={{ width: '20px' }}></Grid>
                      )}
                      <Grid item>
                        <StyledLabel>
                          <StyledTypography
                            fontSize={isMobile ? '12px' : '14px'}
                          >
                            {getlabel('MM_NM_Task', labels, i18n.language)}
                          </StyledTypography>
                        </StyledLabel>
                      </Grid>
                      <Grid item>
                        <Typography fontSize={isMobile ? '12px' : '14px'}>
                          :
                        </Typography>
                      </Grid>
                      <Grid item>
                        <StyledValue>
                          <StyledTypography
                            fontSize={isMobile ? '12px' : '14px'}
                          >
                            {task}
                          </StyledTypography>
                        </StyledValue>
                      </Grid>
                    </Grid>
                  </StyledHeaderContainer>

                  <FlexContainer
                    flexDirection={isMobile ? 'column' : 'row'}
                    alignItems="center"
                    justifyContent={isMobile ? 'flex-start' : 'center'}
                    gap={isMobile ? '10px' : '20px'}
                  >
                    <StyledContainer
                      width={isMobile ? '100%' : '50%'}
                      padding={isMobile ? '10px' : '20px'}
                    >
                      <FlexContainer
                        flexDirection={isMobile ? 'column' : 'row'}
                        alignItems="center"
                        gap={isMobile ? '4px' : '8px'}
                      >
                        <StyledTypography
                          fontWeight="600"
                          fontSize={isMobile ? '16px' : '20px'}
                          lineHeight={isMobile ? '20px' : '24px'}
                        >
                          {getlabel('MM_NM_Designation', labels, i18n.language)}
                        </StyledTypography>
                        <Grid
                          container
                          justifyContent={isMobile ? 'center' : 'flex-end'}
                        >
                          <StyledButton
                            variant="contained"
                            onClick={handleDesignation}
                            gap={isMobile ? '4px' : '8px'}
                            startIcon={
                              <StyledImage
                                height={isMobile ? '7px' : '14px'}
                                width={isMobile ? '7px' : '14px'}
                                src={AddSubMaster}
                                alt="Add New Icon"
                              />
                            }
                          >
                            {t('AddDesignation')}
                          </StyledButton>
                        </Grid>
                      </FlexContainer>
                      <AddDesignationModel
                        open={isDesignationModel}
                        onClose={() => setIsDesignationModel(false)}
                        setIsDesignationModel={setIsDesignationModel}
                        setDesignationFacilityId={setDesignationFacilityId}
                        // designationFacilityId={designationFacilityId}
                      />
                      <DesignationTable
                        columns={designationColumns}
                        labels={labels}
                      />
                    </StyledContainer>
                    <StyledContainer
                      width={isMobile ? '100%' : '50%'}
                      padding={isMobile ? '10px' : '20px'}
                    >
                      <StyledContainer>
                        <StyledTypography
                          fontWeight="600"
                          fontSize={isMobile ? '16px' : '20px'}
                          lineHeight={isMobile ? '20px' : '24px'}
                          textAlign={isMobile ? 'center' : 'left'}
                        >
                          {getlabel('MM_NM_Role', labels, i18n.language)}
                        </StyledTypography>
                      </StyledContainer>
                      <RoleTable
                        columns={RoleColumns}
                        labels={labels}
                        tableWidth={isMobile ? '100%' : 'auto'}
                        rowHeight={isMobile ? '40px' : '50px'}
                      />
                    </StyledContainer>
                  </FlexContainer>
                  <StyledContainer
                    width={isMobile ? '100%' : '50%'}
                    style={{ marginTop: '20px' }}
                  >
                    <FlexContainer
                      flexDirection={isMobile ? 'column' : 'row'}
                      alignItems="center"
                      gap={isMobile ? '4px' : '8px'}
                    >
                      <StyledTypography
                        fontWeight="600"
                        fontSize={isMobile ? '16px' : '20px'}
                        lineHeight={isMobile ? '20px' : '24px'}
                        padding="20px 0 0 0"
                      >
                        {getlabel('MM_NM_Staff', labels, i18n.language)}
                      </StyledTypography>
                      <Grid
                        container
                        justifyContent={isMobile ? 'center' : 'flex-end'}
                        padding="15px 0 0 0"
                      >
                        <StyledButton
                          variant="contained"
                          onClick={handleStaff}
                          gap={isMobile ? '4px' : '8px'}
                          startIcon={
                            <StyledImage
                              height={isMobile ? '7px' : '14px'}
                              width={isMobile ? '7px' : '14px'}
                              src={AddSubMaster}
                              alt="Add New Icon"
                            />
                          }
                        >
                          {t('AddStaff')}
                        </StyledButton>
                      </Grid>
                    </FlexContainer>
                    <AddStaffModel
                      open={isStaffModel}
                      onClose={() => setIsStaffModel(false)}
                      setIsStaffModel={setIsStaffModel}
                      setStaffFacilityId={setStaffFacilityId}
                    />
                    <StaffTable columns={staffColumns} labels={labels} />
                  </StyledContainer>
                </StyledContainer>
              </StyledContainer>
              <FlexContainer width="100%" padding="20px">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={9}>
                    <EmailEditor
                      editorRef={editorRef}
                      cleanedCustomTemplates={cleanedCustomTemplates}
                    />
                    {error && (
                      <Typography color="error" variant="body2">
                        {error}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <VariableDataTable
                      data={VariableDetails?.Data}
                      columns={columns}
                      actionRequired={false}
                      labels={labels}
                    />
                  </Grid>
                </Grid>
              </FlexContainer>
              <Grid
                container
                justifyContent="center"
                style={{ marginTop: '20px' }}
              >
                <FlexContainer
                  gap={isMobile ? '8px' : '16px'}
                  justifyContent="center"
                  padding={isMobile ? '0 10px 20px 0px' : '0 15px 40px 0px'}
                  flexDirection={isMobile ? 'column' : 'row'}
                >
                  <CommonStyledButton
                    type="submit"
                    variant="contained"
                    text-color="#0083C0"
                    gap={isMobile ? '4px' : '8px'}
                    disabled={isLoading}
                    startIcon={
                      <StyledImage
                        src={DoneIcon}
                        sx={{
                          marginBottom: '1px',
                          color: '#FFFFFF',
                          height: isMobile ? '12px' : '16px',
                          width: isMobile ? '12px' : '16px',
                        }}
                      />
                    }
                  >
                    <StyledTypography marginTop="1px" color="#FFFFFF">
                      {t('Submit')}
                    </StyledTypography>
                  </CommonStyledButton>
                  <CommonStyledButton
                    variant="outlined"
                    startIcon={
                      <StyledImage
                        src={DoNotDisturbIcon}
                        sx={{
                          height: isMobile ? '12px' : '16px',
                          width: isMobile ? '12px' : '16px',
                        }}
                      />
                    }
                    gap={isMobile ? '4px' : '8px'}
                    onClick={() => navigate('/MainMaster/NotificationMaster')}
                  >
                    <StyledTypography marginTop="1px">
                      {t('Cancel')}
                    </StyledTypography>
                  </CommonStyledButton>
                </FlexContainer>
              </Grid>
            </Form>
          )
        }
      </Formik>
    </>
  );
};

export default NotificationMasterTable;

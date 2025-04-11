import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import EditIcon from '../../../../assets/Icons/EditIconWhite.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { checkAccess } from '../../../../utils/Auth';
import {
  useUpdateReportCustomizationMutation,
  useGetPageLoadDataQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import Label from '../../../../components/Label/Label';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { showToastAlert } from '../../../../utils/SweetAlert';
import * as Yup from 'yup';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';

const ReportCustomization = ({ labels, fieldAccess, expandAll }) => {
  //* Hooks Declaration
  const { t, i18n } = useTranslation();

  //* Selectors
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  //State Variables
  const [roleMenu, setRoleMenu] = useState();
  const [fieldLabels, setFieldLabels] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [sectionsInReport, setSectionInReport] = useState([]);
  const [expand, setExpand] = useState(expandAll);
  const [initialReportValues, setInitialReportValues] = useState({
    selectedSection: [],
  });

  //* Filtering fields access data
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Report Customization-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* RTK Queries
  const [triggerUpdateReport, { isLoading: isUpdating }] =
    useUpdateReportCustomizationMutation();

  const {
    data: pageLoadData,
    isFetching,
    refetch,
  } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  useEffect(() => {
    if (pageLoadData?.Data) {
      setSectionInReport(
        pageLoadData?.Data?.ReportCustomize?.map((section) => ({
          listOfValueId: section.ListOfValueId,
          listGroupKey: section.ListOfGroupKey,
          listOfValue: section.ListOfValue,
          orderSequence: section.OrderSequence,
          isEnabled: section.IsEnabled,
          loginUserId: userDetails?.UserId,
          moduleId: 2,
          // moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
        }))
      );
      setInitialReportValues((prev) => ({
        ...prev,
        selectedSection: pageLoadData?.Data?.ReportCustomize?.filter(
          (x) => x.IsEnabled === true
        )?.map((x) => x.ListOfValueId),
      }));
    }
  }, [pageLoadData]);

  useEffect(() => {
    if (labels?.Data) {
      const regionList = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;
      const labelsList = regionList?.find(
        (x) => x.RegionCode === 'ALL'
      )?.Labels;
      setFieldLabels(labelsList);
    }
  }, [labels]);

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  useEffect(() => {
    setExpand(expandAll);
  }, [expandAll]);

  //* Submit report customization
  const submitReportCustomization = async (values) => {
    let response;

    const updatedSections = sectionsInReport.map((section) => {
      if (values?.selectedSection?.includes(section.listOfValueId)) {
        return {
          listOfValueId: section.listOfValueId,
          loginUserId: userDetails?.UserId,
          moduleId: 2,
          // moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          isEnabled: true,
        };
      } else {
        return {
          listOfValueId: section.listOfValueId,
          loginUserId: userDetails?.UserId,
          moduleId: 2,
          // moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          isEnabled: false,
        };
      }
    });

    try {
      response = await triggerUpdateReport({
        payload: updatedSections,
      });
      if (
        response &&
        response?.data?.Message === 'Record Updated Successfully'
      ) {
        showToastAlert({
          type: 'custom_success',
          text: response?.data?.Message,
          gif: 'SuccessGif',
        });
      }
      refetch();
      setIsEdit(false);
    } catch (error) {
      console.error('Failed to update Report Customization', error);
    }
  };

  //* Validation Schema
  const reportCustomizationValidation = Yup.object().shape({
    selectedSection: Yup.array().when([], {
      is: () =>
        // pageFields?.find((x) => x.FieldId === 'IS_HL_P_NotificationStaff(s)')
        //   ?.IsMandatory
        true,
      then: (schema) =>
        schema
          .min(
            1,
            `${`${getlabel(
              'IM_IS_HL_NotificationStaff(s)',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`}`
          )
          .test(
            'not-empty',
            `${`${getlabel(
              'IM_IS_HL_NotificationStaff(s)',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`}`,
            (value) => value && value.length > 0
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  return (
    <>
      <Accordion
        sx={{ border: '5px', borderColor: '#0083c0' }}
        expanded={expand}
      >
        <AccordionSummary
          style={{ padding: '0 10px' }}
          onClick={() => {
            setExpand((prev) => !prev);
          }}
          expandIcon={
            <StyledImage
              src={ExpandIcon}
              alt="Expand Icon"
              height={'8px'}
              width={'15px'}
            />
          }
          sx={{
            backgroundColor: '#0083c0',
            borderRadius: '8px 8px 0px 0px',
            width: '100%',
            border: '1px solid #0083c0',
          }}
        >
          <Typography
            fontWeight="700"
            lineHeight="20px"
            textAlign="center"
            color="#FFFFFF"
            sx={{
              fontSize: {
                xs: '0.875rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1rem',
              },
            }}
          >
            {getlabel(
              'IM_IS_RC_ReportCustomization',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            width: '100%',
            height: '20vh',
            padding: '0px',
            border: '1px solid #0083c0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isFetching || isUpdating ? (
            <FlexContainer
              justifyContent="center"
              alignItems="center"
              height="100%"
              width="100%"
              position="absolute"
              style={{ top: '0', left: '0' }}
            >
              <StyledImage src={LoadingGif} alt="LoadingGif" />
            </FlexContainer>
          ) : (
            <Formik
              enableReinitialize={true}
              initialValues={initialReportValues}
              validateOnBlur={false}
              validationSchema={reportCustomizationValidation}
              onSubmit={(values) => submitReportCustomization(values)}
            >
              {() => (
                <Form style={{ width: '100%' }}>
                  <Grid
                    container
                    width="100%"
                    item
                    justifyContent={'center'}
                    xs={12}
                    padding={'20px'}
                    spacing={2}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Label
                        bold={true}
                        value={getlabel(
                          'IM_IS_RC_SectionsinReport',
                          {
                            Data: fieldLabels,
                            Status: labels?.Status,
                          },
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find(
                            (x) => x.FieldId === 'IS_RC_P_SectionsinReport'
                          )?.IsMandatory
                        }
                      />
                      <MultiSelectDropdown
                        name="selectedSection"
                        options={
                          sectionsInReport
                            ? sectionsInReport?.map((section) => ({
                                value: section?.listOfValueId,
                                text: section?.listOfValue,
                              }))
                            : []
                        }
                        disabled={!isEdit}
                      />
                      <ErrorMessage
                        name="selectedSection"
                        component="div"
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      />
                    </Grid>
                  </Grid>
                  <FlexContainer
                    gap="15px"
                    justifyContent="flex-end"
                    margin="10px 0"
                    padding="0 20px"
                  >
                    {!isEdit &&
                      checkAccess(
                        isSuperAdmin,
                        roleMenu?.IsView,
                        roleMenu?.IsEdit || false
                      ) && (
                        <StyledButton
                          borderRadius="6px"
                          padding="6px 10px"
                          variant="contained"
                          color="primary"
                          type="button"
                          sx={{ marginLeft: '10px' }}
                          style={{ display: 'inline-flex', gap: '5px' }}
                          onClick={() => {
                            setIsEdit(true);
                          }}
                          startIcon={
                            <StyledImage
                              height="12px"
                              width="12px"
                              src={EditIcon}
                              alt="WhiteSearch"
                            />
                          }
                        >
                          {t('Edit')}
                        </StyledButton>
                      )}
                    {isEdit && (
                      <>
                        <StyledButton
                          borderRadius="6px"
                          padding="6px 10px"
                          variant="contained"
                          color="primary"
                          type="submit"
                          sx={{ marginLeft: '10px' }}
                          style={{ display: 'inline-flex', gap: '5px' }}
                          disabled={isFetching || isUpdating}
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
                          disabled={isFetching || isUpdating}
                          sx={{ marginLeft: '10px' }}
                          style={{ display: 'inline-flex', gap: '5px' }}
                          onClick={() => {
                            setIsEdit(false);
                            refetch();
                          }}
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
                      </>
                    )}
                  </FlexContainer>
                </Form>
              )}
            </Formik>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ReportCustomization;

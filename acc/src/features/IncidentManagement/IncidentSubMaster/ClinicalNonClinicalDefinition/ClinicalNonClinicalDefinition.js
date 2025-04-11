import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  TextareaAutosize,
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
  useGetClinicalNonClinicalQuery,
  useUpdateClinicalNonClinicalMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import Label from '../../../../components/Label/Label';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { showToastAlert } from '../../../../utils/SweetAlert';
import * as Yup from 'yup';

const ClinicalNonClinicalDefinition = ({ labels, fieldAccess, expandAll }) => {
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
  const [expand, setExpand] = useState(expandAll);
  const [initialClinicalValues, setInitialClinicalValues] = useState({
    clinicallId: 0,
    clinical: '',
    nonClinical: '',
  });

  //* Filtering fields access data
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) =>
        sectionName?.SectionName === 'Clinical/Non Clinical Definition-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* RTK Queries
  const [triggerUpdateClinical, { isLoading: isUpdating }] =
    useUpdateClinicalNonClinicalMutation();

  const {
    data: clinicalNonClinicalDetails,
    isFetching,
    refetch,
  } = useGetClinicalNonClinicalQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 25,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: 2,
        // moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  //* Use Effect to bind data

  useEffect(() => {
    if (clinicalNonClinicalDetails?.Records) {
      setInitialClinicalValues({
        clinicallId: clinicalNonClinicalDetails?.Records[0]?.DefinitionId,
        clinical: clinicalNonClinicalDetails?.Records[0]?.ClinicalDefinition,
        nonClinical:
          clinicalNonClinicalDetails?.Records[0]?.NonClinicalDefinition,
      });
    }
  }, [clinicalNonClinicalDetails]);

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

  const submitClinicalNonClinical = async (values) => {
    let response;
    try {
      if (initialClinicalValues?.clinicallId !== 0) {
        response = await triggerUpdateClinical({
          payload: {
            definitionId: values?.clinicallId,
            clinicalDefinition: values?.clinical,
            nonClinicalDefinition: values?.nonClinical,
            facilityId: selectedFacility?.id,
            moduleId: 2,
            // moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
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
      }
    } catch (error) {
      console.error('Failed to update Common setup', error);
    }
  };

  //* Validation Schema
  const clinicalValidation = Yup.object().shape({
    clinical: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_CND_P_Clinical')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_CND_Clinical',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    nonClinical: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_CND_P_NonClinical')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_CND_NonClinical',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
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
              'IM_IS_CND_Clinical/NonClinicalDefinition',
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
            height: isFetching || isUpdating ? '30vh' : 'auto',
            padding: '0px',
            border: '1px solid #0083c0',
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
              initialValues={initialClinicalValues}
              validateOnBlur={false}
              validationSchema={clinicalValidation}
              onSubmit={(values) => submitClinicalNonClinical(values)}
            >
              {({ values, setFieldValue }) => (
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
                    {pageFields?.find((x) => x.FieldId === 'IS_CND_P_Clinical')
                      ?.IsShow && (
                      <Grid item xs={12} sm={12} md={6} lg={5}>
                        <Label
                          bold={true}
                          value={getlabel(
                            'IM_IS_CND_Clinical',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IS_CND_P_Clinical'
                            )?.IsMandatory
                          }
                        />
                        <Field name="clinical">
                          {({ field }) => (
                            <TextareaAutosize
                              name="clinical"
                              maxRows={10}
                              {...field}
                              minRows={10}
                              disabled={!isEdit}
                              style={{
                                width: '100%',
                                resize: 'none',
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="clinical"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    )}

                    {pageFields?.find(
                      (x) => x.FieldId === 'IS_CND_P_NonClinical'
                    )?.IsShow && (
                      <Grid item xs={12} sm={12} md={6} lg={5}>
                        <Label
                          bold={true}
                          value={getlabel(
                            'IM_IS_CND_NonClinical',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IS_CND_P_NonClinical'
                            )?.IsMandatory
                          }
                        />
                        <Field name="nonClinical">
                          {({ field }) => (
                            <TextareaAutosize
                              maxRows={10}
                              {...field}
                              minRows={10}
                              disabled={!isEdit}
                              name="nonClinical"
                              style={{
                                width: '100%',
                                resize: 'none',
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="nonClinical"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    )}
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
                            setInitialClinicalValues({
                              clinicallId:
                                clinicalNonClinicalDetails?.Records[0]
                                  ?.DefinitionId,
                              clinical:
                                clinicalNonClinicalDetails?.Records[0]
                                  ?.ClinicalDefinition,
                              nonClinical:
                                clinicalNonClinicalDetails?.Records[0]
                                  ?.NonClinicalDefinition,
                            });
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

export default ClinicalNonClinicalDefinition;

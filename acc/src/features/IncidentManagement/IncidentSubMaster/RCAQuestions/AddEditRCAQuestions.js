import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  Autocomplete,
  Typography,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import Label from '../../../../components/Label/Label';
import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { getlabel } from '../../../../utils/language';
import { useSelector } from 'react-redux';
import {
  useAddRCAQuestionMutation,
  useAddReferenceNumberMutation,
  useGetRCAQuestionByIdQuery,
  useGetReferenceNumberDataByIdQuery,
  useUpdateRCAQuestionMutation,
  useUpdateReferenceNumberMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { showToastAlert } from '../../../../utils/SweetAlert';
import EmailEditor from '../../../../components/EmailEditor/EmailEditor';

const AddEditRCAQuestions = ({
  showQuestionsModal,
  setShowQuestionsModal,
  selectedQuestionsId,
  setSelectedQuestionsId,
  labels,
  refetch,
  fieldAccess,
}) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();
  const editorRef = useRef(null);

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    isSuperAdmin,
    roleFacilities,
    selectedFacility,
  } = useSelector((state) => state.auth);

  //* State variables
  const [fieldLabels, setFieldLabels] = useState([]);
  const [error, setError] = useState('');
  const [cleanedCustomTemplates, setCleanedCustomTemplates] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    questionId: selectedQuestionsId || 0,
    facility: '',
    questionText: '',
    definition: '',
  });

  //* RTK Queries
  const [triggerAddQuestion, { isLoading: isAdding }] =
    useAddRCAQuestionMutation();
  const [triggerUpdateQuestion, { isLoading: isUpdating }] =
    useUpdateRCAQuestionMutation();

  const {
    data: questionRecords,
    isFetching,
    refetch: refetchQuestionData,
  } = useGetRCAQuestionByIdQuery(
    {
      RCAQuestionstId: selectedQuestionsId,
      loginUserId: userDetails?.UserId,
    },
    { skip: !selectedQuestionsId }
  );

  //* Field access checking
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) =>
        sectionName?.SectionName === 'Incident RCA Questions-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* Use Effects to bind values
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
    if (questionRecords?.Data && selectedQuestionsId) {
      const combinedCustomTemplates = questionRecords?.Data?.QuestionsContent;
      const cleanedCustomTemplates = combinedCustomTemplates?.replace(
        /^"|"$/g,
        ''
      );
      setCleanedCustomTemplates(cleanedCustomTemplates);
      setNewQuestion({
        questionId: questionRecords?.Data?.RCAQuestionstId,
        facility: [questionRecords?.Data?.FacilityId],
        questionText: questionRecords?.Data?.Questions,
        definition: cleanedCustomTemplates,
      });
    }
  }, [questionRecords]);

  //* Validation Schema
  const rcaQuestionValidation = Yup.object().shape({
    questionText: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_RQ_P_QuestionText')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_RQ_QuestionText',
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

  //* Close modal
  const handleOnCancel = () => {
    setNewQuestion({
      questionId: 0,
      facility: '',
      questionText: '',
      definition: '',
    });
    setSelectedQuestionsId(null);
    setShowQuestionsModal(false);
  };

  //* Submit RCA Question
  const submitQuestion = async (values, cleanedContent) => {
    try {
      let response;
      if (newQuestion?.questionId === 0) {
        response = await triggerAddQuestion({
          payload: {
            questions: values?.questionText,
            questionsContent: cleanedContent,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
      }
      if (newQuestion?.questionId !== 0) {
        response = await triggerUpdateQuestion({
          payload: {
            rcaQuestionstId: values?.questionId,
            questions: values?.questionText,
            questionsContent: cleanedContent,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
        refetchQuestionData();
      }

      if (response && response.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          gif: 'SuccessGif',
        });
      }
      if (
        response &&
        response.Message === 'RCA Question Incident Level already exists'
      ) {
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'InfoGif',
        });
      }
      setNewQuestion({
        questionId: 0,
        facility: '',
        questionText: '',
        definition: '',
      });
      refetch();
      setSelectedQuestionsId(null);
      setShowQuestionsModal(false);
    } catch (error) {
      console.error('Failed to add/update reference number', error);
    }
  };

  return (
    <Dialog
      open={showQuestionsModal}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      maxWidth={'xl'}
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
          backgroundColor: '#0083c0',
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
          {getlabel(
            'IM_IS_RQ_IncidentRCAQuestions',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )}
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
        <FlexContainer
          flexWrap="wrap"
          height="100%"
          style={{
            height: isFetching ? '90vh' : 'auto',
          }}
        >
          {isFetching ? (
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
              initialValues={newQuestion}
              validateOnBlur={false}
              validationSchema={rcaQuestionValidation}
              onSubmit={(values) => {
                const content = editorRef.current.getContent();
                const cleanedContent = content
                  .replace(/\\n/g, '')
                  .replace(/\\"/g, '"')
                  .trim();
                if (
                  (cleanedContent === '' || cleanedContent.length === 0) &&
                  pageFields?.find((x) => x.FieldId === 'IS_RQ_P_Definition')
                    ?.IsMandatory === true
                ) {
                  setError(
                    `${getlabel(
                      'IM_IS_RQ_Definition',
                      {
                        Data: fieldLabels,
                        Status: labels?.Status,
                      },
                      i18n.language
                    )} ${t('IsRequired')}`
                  );
                  return;
                } else {
                  setError('');
                  submitQuestion(values, cleanedContent);
                }
              }}
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
                    {pageFields?.find(
                      (x) => x.FieldId === 'IS_RQ_P_QuestionText'
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
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <Label
                            value={getlabel(
                              'IM_IS_RQ_QuestionText',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_RQ_P_QuestionText'
                              )?.IsMandatory
                            }
                          />
                          <Field name="questionText">
                            {({ field }) => (
                              <TextField
                                {...field}
                                id="questionText"
                                autoComplete="off"
                                values={values.questionText}
                                fullWidth={true}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                                disabled={isFetching}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="questionText"
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
                    {pageFields?.find((x) => x.FieldId === 'IS_RQ_P_Definition')
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
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <Label
                            value={getlabel(
                              'IM_IS_RQ_Definition',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_RQ_P_Definition'
                              )?.IsMandatory
                            }
                          />
                          <EmailEditor
                            editorRef={editorRef}
                            cleanedCustomTemplates={cleanedCustomTemplates}
                          />
                          {error && (
                            <Typography color="error" variant="body2">
                              {error}
                            </Typography>
                          )}
                          <ErrorMessage
                            name="definition"
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
                      marginTop={'1rem'}
                    >
                      <StyledButton
                        borderRadius="6px"
                        gap="4px"
                        padding="6px 10px"
                        variant="contained"
                        backgroundColor="#0083c0"
                        type="submit"
                        style={{ display: 'inline-flex', gap: '5px' }}
                        disabled={isAdding || isUpdating}
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
                        disabled={isAdding || isUpdating}
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
          )}
        </FlexContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditRCAQuestions;

import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Autocomplete, Grid } from '@mui/material';
import Label from '../../../components/Label/Label';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import EditIcon from '../../../assets/Icons/EditIconWhite.png';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import { TextField } from '../../../components/TextField/TextField';
import ExpandIcon from '../../../assets/Icons/ExpandIcon.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import { useTranslation } from 'react-i18next';
import {
  useGetAllModuleListQuery,
  useLazyGetAllMenuListQuery,
  useLazyGetFieldLabelDataQuery,
  useLazyGetFieldLabelListQuery,
  useUpdateFieldLabelMutation,
} from '../../../redux/RTK/pageUtilitiesApi';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { showToastAlert } from '../../../utils/SweetAlert';
import { checkAccess } from '../../../utils/Auth';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';

export default function FieldUtilities({ isEditAccess, isViewAccess }) {
  //* Hooks declaraion
  const { t, i18n } = useTranslation();

  //* Selectors
  const {
    selectedFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  //* State variables
  const [moduleList, setModuleList] = useState([]);
  const [pageList, setPageList] = useState([]);
  const [fieldLabelList, setFieldLabelList] = useState([]);
  const [selectedModuleIds, setSelectedModuleIds] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [regionCodeList, setRegionCodeList] = useState([
    {
      text: 'ALL',
      value: 'ALL',
    },
    {
      text: 'ABD',
      value: 'ABD',
    },
  ]);
  const [fieldLabelInitialValues, setFieldLabelInitialValues] = useState({
    moduleName: '',
    pageName: '',
    fieldName: '',
    regionCode: 'ALL',
    proposedEnLabel: '',
    proposedArLabel: '',
  });

  //* Validation schema
  const validationSchema = Yup.object({
    moduleName: Yup.number()
      .required(`${t('ModuleName')} ${t('IsRequired')}`)
      .test('is-zero', `${t('ModuleName')} ${t('IsRequired')}`, (value) => {
        if (value === 0) {
          return false;
        }
        return true;
      }),
    pageName: Yup.number()
      .required(`${t('PageName')} ${t('IsRequired')}`)
      .test('is-zero', `${t('PageName')} ${t('IsRequired')}`, (value) => {
        if (value === 0) {
          return false;
        }
        return true;
      }),
    regionCode: Yup.string()
      .required(`${t('RegionCode')} ${t('IsRequired')}`)
      .test('is-zero', `${t('RegionCode')} ${t('IsRequired')}`, (value) => {
        if (value === 0) {
          return false;
        }
        return true;
      }),
    fieldName: Yup.number()
      .required(`${t('FieldName')} ${t('IsRequired')}`)
      .test('is-zero', `${t('FieldName')} ${t('IsRequired')}`, (value) => {
        if (value === 0) {
          return false;
        }
        return true;
      }),
    proposedEnLabel: Yup.string().required(
      `${t('ProposedEnglishLabel')} ${t('IsRequired')}`
    ),
    proposedArLabel: Yup.string().required(
      `${t('ProposedArabicLabel')} ${t('IsRequired')}`
    ),
  });

  //* RTK Queries
  const [triggerGetAllMenuList] = useLazyGetAllMenuListQuery();
  const [triggerGetFieldLabel] = useLazyGetFieldLabelDataQuery();
  const [triggerGetFieldLabelList] = useLazyGetFieldLabelListQuery();
  const [triggerUpdateFieldLabel, { isLoading: submittingData }] =
    useUpdateFieldLabelMutation();

  //* Get All modules List
  const { data: allModuleList } = useGetAllModuleListQuery(
    {
      payload: {
        loginUserId: userDetails?.UserId,
        pageModuleId: selectedModuleId,
        pageMenuId: selectedMenu?.id,
      },
    },
    {
      skip: !userDetails?.UserId,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (allModuleList?.Records) {
      const moduleListData = allModuleList?.Records?.map((module) => ({
        value: module.ModuleId,
        text: module.DisplayName,
      }));
      setModuleList(moduleListData);
    }
  }, [allModuleList]);

  //* Fecth page menu list data
  const getAllPageList = async (selectedModule) => {
    const result = await triggerGetAllMenuList({
      payload: {
        loginUserId: userDetails?.UserId,
        moduleId: selectedModule,
        menuId: selectedMenu?.id,
        pageModuleId: selectedModuleId,
        pageMenuId: selectedMenu?.id,
      },
    }).unwrap();
    const pageListData = result?.Records?.filter(
      (page) => page?.MenuId !== 1 && page?.MenuId !== 19
    )?.map((page) => ({
      value: page.MenuId,
      text: page.MenuName,
    }));
    setPageList(pageListData);
    setSelectedModuleIds(selectedModule);
  };
  //* Get field label data list
  const getAllFieldLabelList = async (menuId, regionCode = 'ALL') => {
    const result = await triggerGetFieldLabelList({
      payload: {
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleIds,
        menuId: menuId,
        regionCode: regionCode,
        pageModuleId: selectedModuleId,
        pageMenuId: selectedMenu?.id,
        headerFacilityId: selectedFacility?.id,
      },
    }).unwrap();
    const fieldListData = result?.Records?.filter(
      (page) => page?.MenuId !== 1 && page?.MenuId !== 19
    )?.map((page) => ({
      value: page.FieldLabelId,
      text: page.FieldDefaultLabel,
    }));
    setFieldLabelList(fieldListData);
    setSelectedMenuId(menuId);
  };

  //* Fecth field utilites data
  const getFieldUtitliesData = async (fieldLabelId, regionCode = 'ALL') => {
    if (fieldLabelId) {
      const result = await triggerGetFieldLabel({
        payload: {
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleIds,
          menuId: selectedMenuId,
          pageModuleId: selectedModuleId,
          pageMenuId: selectedMenu?.id,
          fieldLabelId: fieldLabelId,
          regionCode: regionCode,
        },
      }).unwrap();
      setSelectedFieldId(fieldLabelId);

      if (
        result?.Records?.FieldEnglishLabel ||
        result?.Records?.FieldArabicLabel
      ) {
        setFieldLabelInitialValues((prev) => ({
          ...prev,
          moduleName: selectedModuleIds,
          pageName: selectedMenuId,
          fieldName: fieldLabelId,
          regionCode: regionCode,
          proposedEnLabel: result?.Records?.FieldEnglishLabel,
          proposedArLabel: result?.Records?.FieldArabicLabel,
        }));
        setSelectedFieldId(result?.Records?.FieldLabelId);
      } else {
        setFieldLabelInitialValues((prev) => ({
          ...prev,
          moduleName: selectedModuleIds,
          pageName: selectedMenuId,
          regionCode: regionCode,
          fieldName: fieldLabelId,
          proposedEnLabel: '',
          proposedArLabel: '',
        }));
      }
    }
  };

  //* Submit field access list
  const submitFieldLabel = async (value) => {
    try {
      const payload = {
        fieldLabelId: selectedFieldId,
        moduleId: selectedModuleIds,
        menuId: selectedMenuId,
        fieldEnglishLabel: value?.proposedEnLabel,
        fieldArabicLabel: value?.proposedArLabel,
        loginUserId: userDetails?.UserId,
        pageModuleId: selectedModuleId,
        pageMenuId: selectedMenu?.id,
        facilityId: selectedFacility?.id,
        fieldDefaultLabel: fieldLabelList.find(
          (x) => x?.value === selectedFieldId
        )?.text,
      };

      let response = await triggerUpdateFieldLabel({
        payload: payload,
      }).unwrap();

      if (response && response.Message === 'Record Updated Successfully') {
        showToastAlert({
          type: 'custom_success',
          text: 'Field Utilties Updated Successfully',
          gif: 'SuccessGif',
        });
      }
      setIsEdit(false);
      setFieldLabelInitialValues({
        moduleName: '',
        pageName: '',
        fieldName: '',
        regionCode: 'ALL',
        proposedEnLabel: '',
        proposedArLabel: '',
      });
    } catch (error) {
      console.error('Failed to update field utitlites', error);
    }
  };

  return (
    <Accordion sx={{ border: '5px', borderColor: '#0083c0' }}>
      <AccordionSummary
        expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          backgroundColor: '#0083c0',
          borderRadius: '8px 8px 0px 0px',
          width: '100%',
          border: '1px solid #0083c0',
        }}
      >
        <StyledTypography
          fontSize="16px"
          fontWeight="700"
          lineHeight="20px"
          textAlign="center"
          color="#FFFFFF"
        >
          {t('FieldUtilities')}
        </StyledTypography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          width: '100%',
          height: '100%',
          padding: '0px 0px 20px 0px',
          border: '1px solid #0083c0',
        }}
      >
        <FlexContainer
          flexDirection="column"
          padding="15px"
          width="100%"
          justifyContent="center"
          alignItems="center"
          style={{
            height: submittingData ? '50vh' : 'auto',
          }}
        >
          {submittingData ? (
            <FlexContainer
              justifyContent="center"
              alignItems="center"
              height="100%"
              width="100%"
              position="absolute"
              style={{ top: '0', left: '0', marginTop: '50px' }}
            >
              <StyledImage src={LoadingGif} alt="LoadingGif" />
            </FlexContainer>
          ) : (
            <Formik
              initialValues={fieldLabelInitialValues}
              enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                submitFieldLabel(values);
              }}
            >
              {({ values, resetForm, setFieldValue }) => (
                <Form style={{ width: '100%' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={3}>
                      <Label value={t('ModuleName')} isRequired={true} />
                      <SearchDropdown
                        disableClearable={true}
                        disabled={!isEdit}
                        name="moduleName"
                        options={[
                          { text: 'Select', value: '' },
                          ...(moduleList || []),
                        ]}
                        getOptionLabel={(option) => option.text || ''}
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
                          moduleList?.find(
                            (option) => option.value === values['moduleName']
                          ) || null
                        }
                        onChange={(event, value) => {
                          value?.value
                            ? getAllPageList(value.value)
                            : setPageList([]);
                          setFieldLabelList([]);
                          setFieldValue('moduleName', value?.value || '');
                          setFieldValue('proposedEnLabel', '');
                          setFieldValue('proposedArLabel', '');
                        }}
                      />
                      <ErrorMessage
                        name="moduleName"
                        component="div"
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3}>
                      <Label value={t('PageName')} isRequired={true} />
                      <SearchDropdown
                        disableClearable={true}
                        name="pageName"
                        disabled={!isEdit}
                        options={[
                          { text: 'Select', value: '' },
                          ...(pageList || []),
                        ]}
                        getOptionLabel={(option) => option.text || ''}
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
                          pageList?.find(
                            (option) => option.value === values['pageName']
                          ) || null
                        }
                        onChange={(event, value) => {
                          value?.value
                            ? getAllFieldLabelList(value.value, 'ALL')
                            : setPageList([]);
                          setFieldLabelList([]);
                          setFieldValue('pageName', value ? value?.value : '');
                          setFieldValue('fieldName', '');
                          setFieldValue('regionCode', 'ALL');
                          setFieldValue('proposedEnLabel', '');
                          setFieldValue('proposedArLabel', '');
                        }}
                      />
                      <ErrorMessage
                        name="pageName"
                        component="div"
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3}>
                      <Label value={t('RegionCode')} isRequired={true} />
                      <SearchDropdown
                        disableClearable={true}
                        disabled={!isEdit}
                        name="regionCode"
                        options={[
                          { text: 'Select', value: '' },
                          ...(regionCodeList || []),
                        ]}
                        getOptionLabel={(option) => option.text || ''}
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
                          regionCodeList?.find(
                            (option) => option.value === values['regionCode']
                          ) || null
                        }
                        onChange={(event, value) => {
                          value?.value
                            ? getAllFieldLabelList(
                                values?.pageName,
                                value?.value
                              )
                            : setPageList([]);
                          setFieldLabelList([]);
                          setFieldValue('fieldName', '');
                          setFieldValue('regionCode', value?.value);
                          setFieldValue('proposedEnLabel', '');
                          setFieldValue('proposedArLabel', '');
                        }}
                      />
                      <ErrorMessage
                        name="regionCode"
                        component="div"
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3}>
                      <Label value={t('FieldName')} isRequired={true} />
                      <SearchDropdown
                        disableClearable={true}
                        name="fieldName"
                        disabled={!isEdit}
                        options={[
                          { text: 'Select', value: '' },
                          ...(fieldLabelList || []),
                        ]}
                        getOptionLabel={(option) => option.text || ''}
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
                          fieldLabelList?.find(
                            (option) => option.value === values['fieldName']
                          ) || null
                        }
                        onChange={(event, value) => {
                          getFieldUtitliesData(
                            value?.value,
                            values?.regionCode
                          );
                          setFieldValue('fieldName', value ? value?.value : '');
                        }}
                      />
                      <ErrorMessage
                        name="fieldName"
                        component="div"
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3}>
                      <Label
                        value={t('ProposedEnglishLabel')}
                        isRequired={true}
                      />
                      <Field name="proposedEnLabel">
                        {({ field }) => (
                          <TextField
                            {...field}
                            id="proposedEnLabel"
                            disabled={!isEdit}
                            autoComplete="off"
                            values={values.proposedEnLabel}
                            slotProps={{
                              htmlInput: {
                                maxLength: 150,
                              },
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="proposedEnLabel"
                        component="div"
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3}>
                      <Label
                        value={t('ProposedArabicLabel')}
                        isRequired={true}
                      />
                      <Field name="proposedArLabel">
                        {({ field }) => (
                          <TextField
                            {...field}
                            id="proposedArLabel"
                            disabled={!isEdit}
                            autoComplete="off"
                            values={values.proposedArLabel}
                            slotProps={{
                              htmlInput: {
                                maxLength: 300,
                              },
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="proposedArLabel"
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
                  >
                    {!isEdit &&
                      checkAccess(
                        isSuperAdmin,
                        isViewAccess,
                        isEditAccess || false
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
                            resetForm();
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
                          disabled={submittingData}
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
                          style={{ display: 'inline-flex', gap: '5px' }}
                          onClick={() => {
                            setIsEdit(false);
                            setFieldLabelInitialValues({
                              moduleName: '',
                              pageName: '',
                              fieldName: '',
                              proposedEnLabel: '',
                              regionCode: 'ALL',
                              proposedArLabel: '',
                            });
                            resetForm();
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
        </FlexContainer>
      </AccordionDetails>
    </Accordion>
  );
}

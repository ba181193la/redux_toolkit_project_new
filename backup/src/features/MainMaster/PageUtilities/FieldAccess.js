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
import Label from '../../../components/Label/Label';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import SearchIcon from '../../../assets/Icons/WhiteSearch.png';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import EditIcon from '../../../assets/Icons/EditIconWhite.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import ExpandIcon from '../../../assets/Icons/ExpandIcon.png';
import React, { useEffect, useState } from 'react';
import {
  useGetAllModuleListQuery,
  useLazyGetAllMenuListQuery,
  useLazyGetAllFieldAccessListQuery,
  useUpdateFieldAccessListMutation,
  useLazyGetAllSubPageListQuery,
} from '../../../redux/RTK/pageUtilitiesApi';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Autocomplete,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../utils/DataTable.styled';
import styled from 'styled-components';
import { showToastAlert } from '../../../utils/SweetAlert';
import { checkAccess } from '../../../utils/Auth';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';

const SmallRadio = styled(Radio)`
  &.MuiRadio-root {
    transform: scale(0.8);
  }
`;

export default function FieldAccess({ isEditAccess, isViewAccess }) {
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
  const [subPageList, setSubPageList] = useState([]);
  const [allFieldList, setAllFieldList] = useState([]);
  const [fieldAccessList, setFieldAccessList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [selectedSubPage, setSelectedSubPage] = useState(null);
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
  const [fieldAccessInitialValues, setFieldAccessInitialValues] = useState({
    moduleName: '',
    pageName: '',
    subPage: '',
    regionCode: 'ALL',
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
  });

  //* RTK Queries
  const [triggerGetAllMenuList] = useLazyGetAllMenuListQuery();
  const [triggerGetAllFieldAccessList, { isFetching: fetchingData }] =
    useLazyGetAllFieldAccessListQuery();
  const [triggerGetAllSubPageList] = useLazyGetAllSubPageListQuery();
  const [triggerUpdateFieldAccess, { isLoading: submittingData }] =
    useUpdateFieldAccessListMutation();

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

  //* Handle change for radio buttons
  const handleMandatoryRadioChange = (row, value) => {
    const updatedList = fieldAccessList.map((x) => {
      if (row.PageUtilityId === x.PageUtilityId) {
        return {
          ...x,
          IsMandatory: value === 'yes',
        };
      }
      return x;
    });
    setFieldAccessList(updatedList);
  };

  //* Handle change for radio buttons
  const handleShowRadioChange = (row, value) => {
    const updatedList = fieldAccessList.map((x) => {
      if (row.PageUtilityId === x.PageUtilityId) {
        return {
          ...x,
          IsShow: value === 'yes',
        };
      }
      return x;
    });
    setFieldAccessList(updatedList);
  };

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
    ).map((page) => ({
      value: page.MenuId,
      text: page.MenuName,
    }));
    setPageList(pageListData);
    setSelectedModuleIds(selectedModule);
  };

  //* Fecth sub page menu list data
  const getAllSubPageList = async (selectedMenuId) => {
    const result = await triggerGetAllSubPageList({
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleIds,
      menuId: selectedMenuId,
      headerFacilityId: selectedFacility?.id,
    }).unwrap();
    if (result) {
      let subPageListData = [...new Set(result?.Data)];
      const mappedSubPages = subPageListData?.map((page) => ({
        value: page,
        text: page,
      }));
      setSubPageList(mappedSubPages);
    }
  };

  //* Get all field access data
  const getAllFieldAccessList = async (values) => {
    const result = await triggerGetAllFieldAccessList({
      payload: {
        loginUserId: userDetails?.UserId,
        moduleId: values?.moduleName,
        menuId: values?.pageName,
        subPage: values?.subPage,
        pageModuleId: selectedModuleId,
        pageMenuId: selectedMenu?.id,
        headerFacilityId: selectedFacility?.id,
        regionCode: values?.regionCode,
      },
    }).unwrap();
    setAllFieldList(result?.Records);
    setFieldAccessList([...result?.Records]);
    setSelectedModuleIds(values?.moduleName);
    setSelectedMenuId(values?.pageName);
    setSelectedSubPage(values?.subPage);
  };
  const groupedBySection = fieldAccessList?.reduce((acc, row) => {
    const { ScreenSection } = row;
    if (!acc[ScreenSection]) {
      acc[ScreenSection] = [];
    }
    acc[ScreenSection].push(row);
    return acc;
  }, {});

  //* Submit field access list
  const submitFieldAccess = async () => {
    try {
      const modifiedList = fieldAccessList.map((x) => {
        return {
          pageUtilityId: x.PageUtilityId,
          isShow: x.IsShow,
          isMandatory: x.IsMandatory,
          moduleId: selectedModuleIds,
          menuId: selectedMenuId,
          loginUserId: userDetails?.UserId,
          pageModuleId: selectedModuleId,
          pageMenuId: selectedMenu?.id,
          subPage: selectedSubPage,
          facilityId: selectedFacility?.id,
        };
      });

      let response = await triggerUpdateFieldAccess({
        payload: modifiedList,
      }).unwrap();

      if (response && response.Message === 'Record Updated Successfully') {
        showToastAlert({
          type: 'custom_success',
          text: 'Field Access Updated Successfully',
          gif: 'SuccessGif',
        });
      }
      setIsEdit(false);
    } catch (error) {
      console.error('Failed to update field access', error);
      gif: 'InfoGif';
    }
  };

  //* Cancel module access section data
  const handleOnCancel = () => {
    setIsEdit(false);
    setFieldAccessList(allFieldList);
  };

  return (
    <Accordion
      sx={{ border: '5px', borderColor: '#0083c0', marginBlockEnd: '20px' }}
    >
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
          {t('FieldAccess')}
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
        <FlexContainer padding="15px" width="100%">
          <Formik
            initialValues={fieldAccessInitialValues}
            enableReinitialize={true}
            validateOnChange={true}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              getAllFieldAccessList(values);
            }}
          >
            {({ values, setFieldValue, errors }) => (
              <Form style={{ width: '100%' }}>
                <Grid container spacing={2} alignItems={'flex-start'}>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <Label value={t('ModuleName')} isRequired={true} />
                    <SearchDropdown
                      disableClearable={true}
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
                        moduleList.find(
                          (option) => option.value === values['moduleName']
                        ) || null
                      }
                      onChange={(event, value) => {
                        value?.value
                          ? getAllPageList(value.value)
                          : setPageList([]);
                        setSubPageList([]);
                        setFieldAccessList([]);
                        setFieldValue('moduleName', value ? value?.value : '');
                        if (!values?.moduleName) {
                          setFieldValue('pageName', '');
                          setFieldValue('subPage', '');
                        }
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
                        pageList.find(
                          (option) => option.value === values['pageName']
                        ) || null
                      }
                      onChange={(event, value) => {
                        value?.value
                          ? getAllSubPageList(value.value)
                          : setPageList([]);
                        setSubPageList([]);
                        setFieldAccessList([]);
                        setFieldValue('pageName', value ? value?.value : '');
                        if (!values?.pageName) {
                          setFieldValue('subPage', '');
                        }
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
                    <Label value={t('SubPage')} isRequired={false} />

                    <SearchDropdown
                      disableClearable={true}
                      name="subPage"
                      options={[
                        { text: 'Select', value: '' },
                        ...(subPageList || []),
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
                        subPageList?.find(
                          (option) => option.value === values['subPage']
                        ) || null
                      }
                      onChange={(event, value) => {
                        setFieldValue('subPage', value ? value?.value : '');
                      }}
                    />
                    <ErrorMessage
                      name="subPage"
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
                        setFieldValue('regionCode', value ? value?.value : '');
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
                </Grid>
                <Grid container spacing={2} alignItems={'flex-start'}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    alignSelf="flex-start"
                    sx={{
                      paddingTop: {
                        md: '33px !important',
                        xs: '10px !important',
                        sm: '10px !important',
                        lg: '33px !important',
                        xl: '33px !important',
                      },
                    }}
                  >
                    <StyledButton
                      borderRadius="6px"
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{
                        marginLeft: '10px',
                        height: '32px',
                        padding: '5px 10px',
                      }}
                      style={{
                        display: 'inline-flex',
                        gap: '5px',
                        marginBottom:
                          errors?.moduleName || errors?.pageName
                            ? '18px !important'
                            : '0px !important',
                      }}
                      disabled={fetchingData}
                      startIcon={
                        <StyledImage
                          height="15px"
                          width="15px"
                          src={SearchIcon}
                          alt="WhiteSearch"
                        />
                      }
                    >
                      {t('Fetch')}
                    </StyledButton>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </FlexContainer>

        <FlexContainer
          flexDirection="column"
          width="100%"
          padding="15px"
          justifyContent="center"
          alignItems="center"
          style={{
            height: submittingData || fetchingData ? '50vh' : 'auto',
          }}
        >
          {fetchingData || submittingData ? (
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
            <>
              <TableContainer
                component={FlexContainer}
                style={{ border: '1px solid #99cde6' }}
              >
                <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                  <StyledTableHead backgroundColor="#DEF5FF" borderLeft="none">
                    <TableRow>
                      <StyledTableHeaderCell color="#000000A6">
                        {t('FIELDS')}
                      </StyledTableHeaderCell>
                      <StyledTableHeaderCell color="#000000A6">
                        {t('SHOW')}
                      </StyledTableHeaderCell>
                      <StyledTableHeaderCell color="#000000A6">
                        {t('MANDATORY')}
                      </StyledTableHeaderCell>
                    </TableRow>
                  </StyledTableHead>

                  {fieldAccessList?.length > 0 ? (
                    Object.keys(groupedBySection).map((sectionKey) => {
                      const sectionItems = groupedBySection[sectionKey];
                      return (
                        <>
                          <TableRow>
                            <StyledTableBodyCell
                              colSpan={3}
                              style={{ padding: '0px' }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  width: '100%',
                                  fontWeight: 600,
                                  fontSize: '12px',
                                  padding: '10px 15px',
                                  borderTop: '1px solid #99cde6',
                                  backgroundColor: '#EEEEEE',
                                  letterSpacing: '1px',
                                }}
                              >
                                {sectionKey}
                              </Typography>
                            </StyledTableBodyCell>
                          </TableRow>

                          <TableBody>
                            {sectionItems.map((row, rowIndex) => (
                              <StyledTableRow key={rowIndex}>
                                <StyledTableBodyCell
                                  style={{ padding: '5px 15px' }}
                                >
                                  {row?.FieldEnglishLabel}
                                </StyledTableBodyCell>
                                <StyledTableBodyCell
                                  marginRight="4px"
                                  style={{ padding: '5px 15px' }}
                                >
                                  <RadioGroup
                                    row
                                    value={row.IsShow ? 'yes' : 'no'}
                                    onChange={(e) =>
                                      handleShowRadioChange(row, e.target.value)
                                    }
                                    style={{ flexWrap: 'nowrap' }}
                                  >
                                    <FlexContainer alignItems="center">
                                      <SmallRadio
                                        size="medium"
                                        color="primary"
                                        value="yes"
                                        disabled={
                                          !isEdit || row.DisableShowAccess
                                        }
                                      />
                                      <Typography fontSize="12px">
                                        {t('Yes')}
                                      </Typography>
                                    </FlexContainer>
                                    <FlexContainer alignItems="center">
                                      <SmallRadio
                                        size="medium"
                                        color="primary"
                                        value="no"
                                        disabled={
                                          !isEdit || row.DisableShowAccess
                                        }
                                      />
                                      <Typography fontSize="12px">
                                        {t('No')}
                                      </Typography>
                                    </FlexContainer>
                                  </RadioGroup>
                                </StyledTableBodyCell>
                                <StyledTableBodyCell
                                  marginRight="4px"
                                  style={{ padding: '5px 15px' }}
                                >
                                  <RadioGroup
                                    row
                                    value={row.IsMandatory ? 'yes' : 'no'}
                                    onChange={(e) =>
                                      handleMandatoryRadioChange(
                                        row,
                                        e.target.value
                                      )
                                    }
                                    style={{ flexWrap: 'nowrap' }}
                                  >
                                    <FlexContainer alignItems="center">
                                      <SmallRadio
                                        size="medium"
                                        color="primary"
                                        value="yes"
                                        disabled={
                                          !isEdit || row.DisableMandatoryAccess
                                        }
                                      />
                                      <Typography fontSize="12px">
                                        {t('Yes')}
                                      </Typography>
                                    </FlexContainer>
                                    <FlexContainer alignItems="center">
                                      <SmallRadio
                                        size="medium"
                                        color="primary"
                                        value="no"
                                        disabled={
                                          !isEdit || row.DisableMandatoryAccess
                                        }
                                      />
                                      <Typography fontSize="12px">
                                        {t('No')}
                                      </Typography>
                                    </FlexContainer>
                                  </RadioGroup>
                                </StyledTableBodyCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </>
                      );
                    })
                  ) : (
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableBodyCell
                          colSpan={3}
                          style={{ textAlign: 'center' }}
                        >
                          {t('NoDataAvailable')}
                        </StyledTableBodyCell>
                      </StyledTableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
              <Grid
                paddingBlockStart="10px"
                item
                xs={12}
                display="flex"
                justifyContent="flex-end"
                gap="10px"
                width="100%"
              >
                {!isEdit &&
                  fieldAccessList?.length > 0 &&
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
                      type="submit"
                      sx={{ marginLeft: '10px' }}
                      style={{ display: 'inline-flex', gap: '5px' }}
                      onClick={() => setIsEdit(true)}
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
                      onClick={submitFieldAccess}
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
                      {submittingData ? t('Submitting...') : t('Submit')}
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
                  </>
                )}
              </Grid>
            </>
          )}
        </FlexContainer>
      </AccordionDetails>
    </Accordion>
  );
}

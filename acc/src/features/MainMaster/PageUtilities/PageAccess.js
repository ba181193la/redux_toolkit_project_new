import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
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
import Label from '../../../components/Label/Label';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import SearchIcon from '../../../assets/Icons/WhiteSearch.png';
import ExpandIcon from '../../../assets/Icons/ExpandIcon.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useLazyGetAllMenuListQuery,
  useGetAllModuleListQuery,
  useUpdateMenuListMutation,
} from '../../../redux/RTK/pageUtilitiesApi';
import {
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../utils/DataTable.styled';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import EditIcon from '../../../assets/Icons/EditIconWhite.png';
import styled from 'styled-components';
import { showToastAlert } from '../../../utils/SweetAlert';
import { checkAccess } from '../../../utils/Auth';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';

const SmallRadio = styled(Radio)`
  &.MuiRadio-root {
    transform: scale(0.8);
  }
`;

const PageAccess = ({ isEditAccess, isViewAccess }) => {
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
  const [allMenuList, setAllMenuList] = useState([]);
  const [menuAccessList, setMenuAccessList] = useState([]);
  const [searchedModuleId, setSearchedModuleId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

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
  });

  //* RTK Queries
  const [triggerGetAllMenuList, { isFetching: fetchingData }] =
    useLazyGetAllMenuListQuery();
  const [triggerUpdateMenuAccessList, { isLoading: submittingData }] =
    useUpdateMenuListMutation();

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
  const handleRadioChange = (row, value) => {
    const updatedList = menuAccessList.map((x) => {
      if (row.MenuId === x.MenuId) {
        return {
          ...x,
          IsDeployed: value === 'yes',
        };
      }
      return x;
    });
    setMenuAccessList(updatedList);
  };

  //* Fecth page access data
  const getAllMenuList = async (values) => {
    setSearchedModuleId(values?.moduleName);
    if (values?.moduleName) {
      const result = await triggerGetAllMenuList({
        payload: {
          loginUserId: userDetails?.UserId,
          moduleId: values?.moduleName,
          pageModuleId: selectedModuleId,
          pageMenuId: selectedMenu?.id,
        },
      }).unwrap();

      const pageListData = result?.Records?.filter(
        (page) => page?.MenuId !== 1 && page?.MenuId !== 19
      );
      setAllMenuList(pageListData);
      setMenuAccessList([...pageListData]);
    } else {
      setMenuAccessList([]);
    }
  };

  //* Cancel menu access section data
  const handleOnCancel = () => {
    setIsEdit(false);
    setMenuAccessList(allMenuList);
  };

  //* Submit page access data
  const submitPageAccess = async () => {
    try {
      const modifiedList = menuAccessList.map((x) => {
        return {
          loginUserId: userDetails?.UserId,
          isDeployed: x.IsDeployed,
          moduleId: searchedModuleId,
          menuId: x.MenuId,
          pageModuleId: selectedModuleId,
          pageMenuId: selectedMenu?.id,
          facilityId: selectedFacility?.id,
        };
      });
      let response = await triggerUpdateMenuAccessList({
        payload: modifiedList,
      }).unwrap();
      if (response && response.Message === 'Record Updated Successfully') {
        showToastAlert({
          type: 'custom_success',
          text: 'Page Access Updated Successfully',
          gif: 'SuccessGif'
        });
      }
      setIsEdit(false);
    } catch (error) {
      console.error('Failed to update page access', error);
    }
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
          {t('PageAccess')}
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
            initialValues={{ moduleName: '' }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            validateOnChange={true}
            onSubmit={(values) => {
              getAllMenuList(values);
            }}
          >
            {({ values, errors, setFieldValue }) => (
              <Form style={{ width: '100%' }}>
                <Grid container spacing={2} alignItems={'flex-end'}>
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
                        if (!value?.value) {
                          setMenuAccessList([]);
                        }
                        setFieldValue('moduleName', value ? value?.value : '');
                      }}
                    />

                    <ErrorMessage
                      name="moduleName"
                      component="div"
                      style={{
                        color: 'red',
                        fontSize: '12px',
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    alignSelf="center"
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
                    {errors?.moduleName && <p></p>}
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
                        {t('PAGENAME')}
                      </StyledTableHeaderCell>
                      <StyledTableHeaderCell color="#000000A6">
                        {t('ACCESSRIGHTS')}
                      </StyledTableHeaderCell>
                    </TableRow>
                  </StyledTableHead>

                  {menuAccessList?.length > 0 ? (
                    <TableBody>
                      {menuAccessList.map((row, rowIndex) => (
                        <StyledTableRow key={rowIndex}>
                          <StyledTableBodyCell style={{ padding: '5px 15px' }}>
                            {row?.MenuName}
                          </StyledTableBodyCell>
                          <StyledTableBodyCell
                            marginRight="4px"
                            style={{ padding: '5px 15px' }}
                          >
                            <RadioGroup
                              row
                              value={row.IsDeployed ? 'yes' : 'no'}
                              onChange={(e) =>
                                handleRadioChange(row, e.target.value)
                              }
                              style={{ flexWrap: 'nowrap' }}
                            >
                              <FlexContainer alignItems="center">
                                <SmallRadio
                                  size="medium"
                                  color="primary"
                                  value="yes"
                                  disabled={!isEdit}
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
                                  disabled={!isEdit}
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
                  ) : (
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableBodyCell
                          colSpan={2}
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
                  menuAccessList?.length > 0 &&
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
                      onClick={submitPageAccess}
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
};

export default PageAccess;

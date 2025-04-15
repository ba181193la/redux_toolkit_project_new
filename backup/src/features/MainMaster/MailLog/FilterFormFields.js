import { Formik } from 'formik';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Label from '../../../components/Label/Label';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../utils/StyledComponents';
import WhiteSearch from '../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../assets/Icons/Eraser.png';
import MultiSelectDropdown from '../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../utils/language';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../redux/features/mainMaster/mailLogSlice';
import {
  useGetAllFacilityQuery,
  useGetMailLogDataQuery,
} from '../../../redux/RTK/mailLogApi';
import Date from '../../../components/Date/Date';
import { TextField } from '../../../components/TextField/TextField';
import { useRef, useState } from 'react';
import DropdownIcon from '../../../assets/Icons/downArrow.png';
import { Autocomplete, Grid, InputAdornment } from '@mui/material';
import useWindowDimension from '../../../hooks/useWindowDimension';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';

const FilterFormFields = ({ fields, handleToggleFilter, labels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { isMobile, isTablet } = useWindowDimension();

  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    roleFacilities,
    isSuperAdmin,
    selectedFacility,
  } = useSelector((state) => state.auth);

  const {
    pageSize,
    pageIndex,
    moduleName,
    pageName,
    sendDateFrom,
    sendDateTO,
    referenceNo,
    facilityId,
  } = useSelector((state) => state.mailLog.filters);
  const [selectedIds, setSelectedIds] = useState();

  const { data: pageLoadData } = useGetMailLogDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const { data: facilityData } = useGetAllFacilityQuery({
    payload: {
      pageIndex: 1,
      pageSize: 100,
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
      loginUserId: userDetails?.UserId,
      headerFacilityId: selectedFacility?.id,
    },
  });

  const ActiveFacilities = facilityData?.Records?.filter(
    (facility) => facility?.IsActive === true
  );

  const initialValues = {
    moduleName: moduleName || '',
    pageName: pageName || '',
    sendDateFrom: sendDateFrom || '',
    sendDateTo: sendDateTO || '',
    toMailStaffName: '',
    referenceNo: referenceNo || '',
    facility: facilityId || '',
  };

  const fieldsConfig = [
    {
      fieldId: 'ML_S_ModuleName',
      translationId: 'MM_ML_ModuleName',
      component: 'Dropdown',
      name: 'moduleName',
      options: pageLoadData?.Data.ModuleList?.map((moduleList) => ({
        text: moduleList.ModuleName,
        value: moduleList.ModuleId,
      })),
    },
    {
      fieldId: 'ML_S_PageName',
      translationId: 'MM_ML_PageName',
      component: 'Dropdown',
      name: 'pageName',
      options: pageLoadData?.Data.PageName?.map((menu) => ({
        text: menu.MenuName,
        value: menu.MenuId,
      })),
    },
    {
      fieldId: 'ML_S_SendDateFrom',
      translationId: 'MM_ML_SendDateFrom',
      component: 'Date',
      name: 'sendDateFrom',
    },
    {
      fieldId: 'ML_S_SendDateTo',
      translationId: 'MM_ML_SendDateTo',
      component: 'Date',
      name: 'sendDateTo',
    },
    {
      fieldId: 'ML_S_ToMailStaffName',
      translationId: 'MM_ML_ToMailStaffName',
      component: 'Dropdown',
      name: 'toMailStaffName',
      options: pageLoadData?.Data.StaffList?.map((staff) => ({
        text: staff.UserName,
        value: staff.UserId,
      })),
    },
    {
      fieldId: 'ML_S_ReferenceNumber',
      translationId: 'MM_ML_ReferenceNumber',
      maxLength: 100,
      component: 'TextField',
      name: 'refNo',
      options:
        pageLoadData?.Data?.ReferenceList?.map((refNo) => ({
          text: refNo.ReferenceNo,
          value: refNo.ReferenceNo,
        })) || [],
    },
    {
      fieldId: 'ML_S_Facility',
      translationId: 'MM_ML_Facility',
      component: 'MultiSelectDropdown',
      name: 'facility',
      options: userDetails?.ApplicableFacilities?.filter((facility) => {
        if (!facility.IsActive) return false;
        if (isSuperAdmin) return true;
        const facilityItem = roleFacilities
          ?.find((role) => role.FacilityId === facility.FacilityId)
          ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
        return facilityItem?.IsView;
      }).map((facility) => ({
        text: facility.FacilityName,
        value: facility.FacilityId,
      })),
      // options: ActiveFacilities?.map((facility) => ({
      //   text: facility.FacilityDetail,
      //   value: facility.FacilityId,
      // })),
    },
  ];

  const searchFields = fields?.Data?.Sections?.find(
    (section) => section.SectionName === 'Search'
  )?.Fields;

  return (
    <>
      <Label>{t('SelectFilter')}</Label>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          const facilityIdsString = Array.isArray(selectedIds)
            ? selectedIds.join(',')
            : '';
          dispatch(
            setFilters({
              pageIndex: pageIndex,
              pageSize,
              loginUserId: userDetails.UserId,
              headerFacility: selectedFacility?.id,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              moduleName: values?.moduleName || 0,
              pageName: values?.pageName || 0,
              sendDateFrom: values?.sendDateFrom,
              sendDateTO: values?.sendDateTo,
              toUserId: values?.toMailStaffName,
              facilityId: facilityIdsString,
              referenceNo: values?.refNo,
            })
          );
          dispatch(setIsFilterApplied(true));
          handleToggleFilter();
        }}
      >
        {({ values, handleSubmit, setFieldValue, resetForm }) => (
          <Grid container spacing={2} display={'flex'}>
            {searchFields?.map((field) => {
              const fieldConfig = fieldsConfig.find(
                (config) => config.fieldId === field.FieldId
              );
              const translatedLabel = getlabel(
                fieldConfig?.translationId,
                labels,
                i18n.language
              );

              if (field.IsShow && fieldConfig) {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    padding={'10px'}
                    md={3}
                    key={field.fieldId}
                  >
                    <Label value={translatedLabel} />
                    {fieldConfig.component === 'Dropdown' && (
                      // <Dropdown
                      //   name={fieldConfig.name}
                      //   options={fieldConfig.options}
                      //   required={field.IsMandatory}
                      //   onChange={(e) =>
                      //     setFieldValue(fieldConfig.name, e.target.value)
                      //   }
                      // />
                      <SearchDropdown
                        // disableClearable={true}
                        name={fieldConfig.name}
                        options={[
                          { text: 'Select', value: '' },
                          ...(fieldConfig.options || []),
                        ]}
                        // getOptionLabel={(option) => option.text}
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                        // sx={{
                        //   '& .MuiAutocomplete-inputRoot': {
                        //     fontSize: '13px',
                        //     height: '100%',
                        //   },
                        //   '& .MuiOutlinedInput-root': {
                        //     height: '34px',
                        //     '& .MuiAutocomplete-input': {
                        //       height: '34px',
                        //       fontSize: '13px',
                        //     },
                        //   },
                        // }}
                        // renderInput={(params) => (
                        //   <TextField
                        //     {...params}
                        //     variant="outlined"
                        //     placeholder="Select"
                        //   />
                        // )}
                        // ListboxProps={{
                        //   sx: {
                        //     '& .MuiAutocomplete-option': {
                        //       fontSize: '14px',
                        //       minHeight: '30px',
                        //       display: 'flex',
                        //       alignItems: 'center',
                        //     },
                        //   },
                        // }}
                        value={
                          fieldConfig?.options?.find(
                            (option) =>
                              option.value === values[fieldConfig.name]
                          ) || null
                        }
                        onChange={(event, value) => {
                          setFieldValue(fieldConfig.name, value?.value);
                        }}
                      />
                    )}

                    {fieldConfig.component === 'MultiSelectDropdown' && (
                      <MultiSelectDropdown
                        name={fieldConfig.name}
                        options={fieldConfig.options}
                        required={field.IsMandatory}
                        setSelectedIds={setSelectedIds}
                      />
                    )}

                    {fieldConfig.component === 'Date' && (
                      <Date
                        name={fieldConfig.name}
                        value={values[fieldConfig.name]}
                        onChange={(date) => {
                          setFieldValue(fieldConfig.name, date);
                        }}
                      />
                    )}

                    {fieldConfig.component === 'TextField' &&
                      fieldConfig.name === 'refNo' &&
                      (() => {
                        const filteredOptions = fieldConfig.options.filter(
                          (option) => option.text.trim() !== ''
                        );

                        return (
                          <SearchDropdown
                            options={filteredOptions}
                            getOptionLabel={(option) => option.text}
                            noOptionsText="No references available"
                            open={open}
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputRef={inputRef}
                                slotProps={{
                                  htmlInput: {
                                    maxLength: fieldConfig.maxLength,
                                  },
                                }}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <StyledImage
                                        src={DropdownIcon}
                                        alt="Dropdown Icon"
                                        style={{
                                          fontSize: '29px',
                                          cursor: 'pointer',
                                          marginLeft: '8px',
                                        }}
                                        onClick={() => {
                                          inputRef.current.focus();
                                          setOpen(!open);
                                        }}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                                style={{ width: '100%' }}
                              />
                            )}
                            onChange={(event, value) => {
                              setFieldValue(
                                fieldConfig.name,
                                value ? value.value : ''
                              );
                            }}
                            value={
                              filteredOptions.find(
                                (option) =>
                                  option.value === values[fieldConfig.name]
                              ) || null
                            }
                            style={{ width: '100%' }}
                          />
                        );
                      })()}
                  </Grid>
                );
              }
              return null;
            })}
            <FlexContainer
              gap="16px"
              justifyContent={'flex-end'}
              padding={
                isMobile || isTablet ? '15px 10px 25px 0' : '25px 15px 40px 0'
              }
              width="100%"
              margin={isMobile || isTablet ? '0 0 0 20px' : 'auto'}
              flexDirection={isMobile || isTablet ? 'column' : 'row'}
            >
              <StyledButton
                borderRadius="6px"
                gap="8px"
                padding={isMobile || isTablet ? '8px 12px' : '6px 10px'}
                variant="contained"
                color="primary"
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={WhiteSearch}
                    alt="WhiteSearch"
                  />
                }
                onClick={handleSubmit}
                type="submit"
              >
                {t('Search')}
              </StyledButton>
              <StyledButton
                variant="outlined"
                border="1px solid #0083c0"
                backgroundColor="#ffffff"
                colour="#0083c0"
                borderRadius="6px"
                sx={{ marginLeft: '10px' }}
                gap="8px"
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={Eraser}
                    alt="Eraser"
                  />
                }
                onClick={() => {
                  dispatch(resetFilters());
                  resetForm();
                }}
              >
                {t('ClearAll')}
              </StyledButton>
            </FlexContainer>
          </Grid>
        )}
      </Formik>
    </>
  );
};

export default FilterFormFields;

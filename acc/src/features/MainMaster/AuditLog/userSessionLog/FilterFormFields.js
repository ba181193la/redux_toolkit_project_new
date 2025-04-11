import { Formik } from 'formik';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import {
    FlexContainer,
    StyledButton,
    StyledImage,
} from '../../../../utils/StyledComponents';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import {
    resetUserSessionFilters,
    setUserSeesionFilters,
    setIsUserSessionFilterApplied,
} from '../../../../redux/features/mainMaster/auditLogSlice';
import {
    useGetAllFacilityQuery,
    useGetAuditLogDataQuery,
    useGetUserSessionLogQuery
} from '../../../../redux/RTK/auditLogApi';
import Date from '../../../../components/Date/Date';
import { TextField } from '../../../../components/TextField/TextField';
import { useEffect, useRef, useState } from 'react';
import { Autocomplete, Grid, InputAdornment } from '@mui/material';
import DropdownIcon from '../../../../assets/Icons/downArrow.png';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const FilterFormFields = ({ fields, handleToggleFilter, labels }) => {
    const { i18n, t } = useTranslation();
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const [open, setOpen] = useState(false);
    const { isMobile, isTablet } = useWindowDimension();

    const { selectedMenu, selectedModuleId, userDetails, roleFacilities, isSuperAdmin, selectedFacility } =
        useSelector((state) => state.auth);
    const { pageSize, pageIndex, facility, employeeId, fromDate, toDate } = useSelector(
        (state) => state.auditLog.userSessionFilters
    );
    const [selectedIds, setSelectedIds] = useState();

    const { data: pageLoadData } = useGetAuditLogDataQuery({
        menuId: selectedMenu?.id,
        loginUserId: userDetails?.UserId,
        headerFacilityId: selectedFacility?.id,
    });
    const initialValues = {
        facility: facility || '',
        employeeId: employeeId || '',
        fromDate: fromDate || '',
        toDate: toDate || '',
    }
    const fieldsConfig = [
        // {
        //     fieldId: 'MM_P_Facility',
        //     translationId: 'MM_AL_Facility',
        //     component: 'MultiSelectDropdown',
        //     name: 'facility',
        //     options: userDetails?.ApplicableFacilities?.filter((facility) => {
        //       if (!facility.IsActive) return false;
        //       if (isSuperAdmin) return true;
        //       const facilityItem = roleFacilities?.find(
        //         (role) => role.FacilityId === facility.FacilityId
        //       )?.Menu?.find(MenuItem => MenuItem.MenuId === selectedMenu?.id)
        //       return facilityItem?.IsView;
        //     }).map((facility) => ({
        //       text: facility.FacilityName,
        //       value: facility.FacilityId,
        //     }))
        //   },
        {
            fieldId: 'AL_S_FromDate',
            translationId: 'MM_AL_FromDate',
            component: 'Date',
            name: 'fromDate',
        },
        {
            fieldId: 'AL_S_ToDate',
            translationId: 'MM_AL_ToDate',
            component: 'Date',
            name: 'toDate',
        },
        {
            fieldId: 'AL_S_StaffName',
            translationId: 'MM_AL_StaffName',
            component: 'Dropdown',
            name: 'employeeId',
            options: pageLoadData?.Data?.StaffList?.map((staff) => ({
                text: staff.UserName,
                value: staff.EmployeeID,
            }))
        }
    ];
    // const searchFields = [
    //     // {
    //     //     id: 'facility',
    //     //     translationId: 'MM_AL_Facility',
    //     //     FieldId: 'MM_P_Facility',
    //     //     isSelected: true,
    //     // },
    //     {
    //         id: 'employeeId',
    //         translationId: 'MM_AL_EmployeeName',
    //         FieldId: 'AL_P_EmployeeName',
    //         isSelected: true,
    //     },

    //     {
    //         id: 'fromDate',
    //         translationId: 'MM_AL_FromDate',
    //         FieldId: 'AL_P_FromDate',
    //         isSelected: true,
    //     },
    //     {
    //         id: 'toDate',
    //         translationId: 'MM_AL_ToDate',
    //         FieldId: 'AL_P_ToDate',
    //         isSelected: true,
    //     }
    // ]

    const searchFields = Array.isArray(fields?.Data?.Sections)
  ? fields.Data.Sections.find((section) => section.SectionName === 'Search')?.Fields
  : [];
  console.log("UserlogSearch", searchFields)
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
                        setUserSeesionFilters({
                            pageIndex: pageIndex,
                            pageSize: pageSize,
                            headerFacility: selectedFacility?.id,
                            loginUserId: userDetails.UserId,
                            moduleId: selectedModuleId,
                            menuId: selectedMenu?.id,
                            facilityId:facilityIdsString,
                            pageName: values?.pageName || 0,
                            fromDate: values?.fromDate,
                            toDate: values?.toDate,
                            logUserId: userDetails.UserId,
                            employeeId: values?.employeeId
                        })
                    );
                    dispatch(setIsUserSessionFilterApplied(true));
                    handleToggleFilter();
                }}
            >
                {({ values, handleSubmit, setFieldValue, resetForm }) => (
                    <Grid container spacing={2} display={'flex'}>
                        {searchFields?.map((field, index) => {                            
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
                                    key={index}
                                >
                                    <Label value={t(field.translationId)} />
                                    {fieldConfig.component === 'Dropdown' && (
                                        <SearchDropdown
                                            disableClearable={true}
                                            name={fieldConfig.name}
                                            options={[
                                                { text: 'Select', value: '' },
                                                ...(fieldConfig?.options || []),
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
                                                        fontSize: '14px',
                                                        minHeight: '30px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    },
                                                },
                                            }}
                                            value={
                                                fieldConfig?.options?.find(
                                                    (option) => option.value === values[fieldConfig.name]
                                                ) || null
                                            }
                                            onChange={(event, value) => {
                                                setFieldValue(fieldConfig.name, value?.value);
                                            }}                                       />
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
                                    {/* {fieldConfig.component === 'TextField' &&
                                        fieldConfig.name === 'referenceNo' &&
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
                                        })()} */}
                                </Grid>
                            );}
                        })}
                        <FlexContainer
                            gap={isMobile || isTablet ? '8px' : '16px'}
                            // padding='25px 15px 40px 0'
                            padding="10px"
                            width="100%"
                            flexDirection={isMobile || isTablet ? 'column' : 'row'}
                            alignItems={isMobile || isTablet ? 'center' : 'flex-start'}
                            justifyContent={isMobile || isTablet ? 'center' : 'flex-end'}
                        >
                            <StyledButton
                                borderRadius="6px"
                                gap="8px"
                                padding="6px 10px"
                                variant="contained"
                                color="primary"
                                width={isMobile || isTablet ? '100%' : 'auto'} // Full width on mobile
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
                                width={isMobile || isTablet ? '100%' : 'auto'}
                                padding="6px 10px"
                                colour="#0083c0"
                                borderRadius="6px"
                                sx={{ marginLeft: isMobile || isTablet ? '0' : '10px' }}
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
                                    dispatch(resetUserSessionFilters());
                                    resetForm()
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

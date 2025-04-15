import { Formik } from 'formik';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import { StyledButton, StyledImage } from '../../../../utils/StyledComponents';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/staffMasterApi';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/staffMasterSlice';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { Grid } from '@mui/material';

const FilterFormField = ({ fields, handleToggleFilter, labels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();

  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);
  const {
    pageSize,
    pageIndex,
    facilityId,
    searchStaffId,
    employmentTypeId,
    departmentId,
    employeeId,
    designationId,
    staffCategoryId,
    activeStatus,
    adUserLogonName,
  } = useSelector((state) => state.incidentRiskLevel.filters);

  const { data: getFacilityData, isLoading: facilityLoading } =
    useGetFacilityQuery(
      {
        payload: {
          pageIndex: 1,
          pageSize: 100,
          headerFacility: 2,
          loginUserId: userDetails?.UserId,
          moduleId: 2,
          menuId: 22,
        },
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );


  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const initialValues = {
    facility: facilityId?.split(',') || [],
  };
  const fieldsConfig = [
    // {
    //   fieldId: 'SM_S_Facility',
    //   translationId: 'MM_SM_Facility',
    //   label: 'Facility',
    //   component: 'MultiSelectDropdown',
    //   name: 'facility',
    //   options: pageLoadData?.Data.FacilityList?.map((facility) => ({
    //     text: facility.FacilityName,
    //     value: facility.FacilityId,
    //   })),
    // },
    {
        fieldId: 'IRLC_C_P_ConsequenceLevel',
        translationId: 'MM_SM_Facility',
        label: 'Facility',
        component: 'MultiSelectDropdown',
        name: 'consequenceLevel',
        options: getFacilityData?.records?.map((facility) => {
          return {
            text: facility.FacilityDetail, 
            value: facility.FacilityId, 
          };
        }) || []
      }
  ];

  const searchFields = fields?.Data?.Sections?.find(
    (section) => section.SectionName === 'Search'
  )?.Fields;

  const validationSchema = Yup.object().shape(
    searchFields?.reduce((schema, field) => {
      if (field.IsMandatory) {
        schema[field.FieldId] = Yup.string().required(
          `${field.FieldId} is required`
        );
      }
      return schema;
    }, {})
  );

  return (
    <>
      <Label>{t('SelectFilter')}</Label>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          dispatch(
            setFilters({
              pageIndex: pageIndex,
              pageSize,
              headerFacility: selectedFacility?.id,
              loginUserId: userDetails.UserId,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              facilityId:  Array.isArray(values.facility)
              ? values.facility.join(',')
              : values.facility || '',
            })
          );
          dispatch(setIsFilterApplied(true));

          handleToggleFilter();
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
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
                    {fieldConfig.component === 'MultiSelectDropdown' && (
                      <MultiSelectDropdown
                        name={fieldConfig.name}
                        options={fieldConfig.options}
                        required={field.IsMandatory}
                      />
                    )}
                  </Grid>
                );
              }
              return null;
            })}
            <Grid
              padding="10px"
              item
              xs={12}
              display="flex"
              justifyContent="flex-end"
              gap={'10px'}
              flexWrap={'wrap'}
            >
              <StyledButton
                borderRadius="6px"
                padding="6px 10px"
                variant="contained"
                color="primary"
                width={isMobile ? '100%' : ''}
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={WhiteSearch}
                    alt="WhiteSearch"
                    style={{ marginInlineEnd: 5 }}
                  />
                }
                onClick={handleSubmit}
              >
                {t('Search')}
              </StyledButton>
              <StyledButton
                variant="outlined"
                border="1px solid #0083c0"
                backgroundColor="#ffffff"
                colour="#0083c0"
                borderRadius="6px"
                width={isMobile ? '100%' : ''}
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={Eraser}
                    alt="Eraser"
                    style={{ marginInlineEnd: 5 }}
                  />
                }
                onClick={() => dispatch(resetFilters())}
              >
                {t('ClearAll')}
              </StyledButton>
            </Grid>
          </Grid>
        )}
      </Formik>
    </>
  );
};

export default FilterFormField;

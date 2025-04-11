import { Formik } from 'formik';
import Label from '../../../components/Label/Label';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../utils/StyledComponents';
import useWindowDimension from '../../../hooks/useWindowDimension';
import WhiteSearch from '../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../assets/Icons/Eraser.png';
import { useState } from 'react';
import Date from '../../../components/Date/Date';
import { useDispatch } from 'react-redux';
import {
  setFilters,
  setIsFilterApplied,
  resetFilters,
} from '../../../redux/features/mainMaster/integrationLogSlice';
import { useSelector } from 'react-redux';

const FilterFormFields = ({ handleToggleFilter }) => {
  const { i18n, t } = useTranslation();
  const { isMobile, isTablet } = useWindowDimension();
  const dispatch = useDispatch();
  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);

  const { pageSize, pageIndex, logDate } = useSelector(
    (state) => state.integrationLog.filters
  );
  const initialValues = {
    logDate: logDate || '',
  };
  const fieldConfig = [
    {
      fieldId: '',
      translationId: '',
      component: 'Date',
      name: 'logDate',
    },
  ];
  return (
    <>
      <Label>{t('SelectFilter')}</Label>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          dispatch(
            setFilters({
              pageIndex: pageIndex,
              pageSize: pageSize,
              logDate: values?.logDate,
              loginUserId: userDetails.UserId,
              headerFacility: selectedFacility?.id,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
            })
          );
          dispatch(setIsFilterApplied(true));
          handleToggleFilter();
        }}
      >
        {({ values, handleSubmit, setFieldValue, resetForm }) => (
          <Grid container spacing={2} display={'flex'}>
            <Grid
              item
              xs={12}
              sm={4}
              padding={'10px'}
              md={3}
              //   key={field.fieldId}
            >
              <Label value="Log Date" />
              <Date
                name="logDate"
                value={values.logDate}
                onChange={(date) => {
                  setFieldValue('logDate', date);
                }}
              />
            </Grid>
            <FlexContainer
              gap={isMobile || isTablet ? '8px' : '16px'}
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
                width={isMobile || isTablet ? '100%' : 'auto'}
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={WhiteSearch}
                    alt="WhiteSearch"
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

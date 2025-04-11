import React, { useEffect, useState } from 'react';
import {
  FlexContainer,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import ModuleAccess from './ModuleAccess';
import PageAccess from './PageAccess';
import FieldAccess from './FieldAccess';
import FieldUtilities from './FieldUtilities';
import { useSelector } from 'react-redux';

const PageUtilities = () => {
  const { t } = useTranslation();

  //* State Variables
  const [roleMenu, setRoleMenu] = useState();

  //* Selectors
  const { selectedMenu, userDetails, selectedRoleFacility } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
    >
      <FlexContainer justifyContent={'space-between'} padding="0 0 15px 0">
        <StyledTypography
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '1.75rem',
              md: '2rem',
              lg: '2rem',
            },
          }}
        >
          {t('MM_PageUtilities')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="30px 15px 30px 15px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
        >
          {userDetails?.StaffCategoryId === 1 && (
            <ModuleAccess
              isEditAccess={roleMenu?.IsEdit}
              isViewAccess={roleMenu?.IsView}
            />
          )}
          <PageAccess
            isEditAccess={roleMenu?.IsEdit}
            isViewAccess={roleMenu?.IsView}
          />
          <FieldAccess
            isEditAccess={roleMenu?.IsEdit}
            isViewAccess={roleMenu?.IsView}
          />
          <FieldUtilities
            isEditAccess={roleMenu?.IsEdit}
            isViewAccess={roleMenu?.IsView}
          />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default PageUtilities;

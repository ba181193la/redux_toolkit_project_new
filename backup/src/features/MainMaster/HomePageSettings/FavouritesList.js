import React, { useEffect, useState } from 'react';
import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
  SuccessMessage,
} from '../../../utils/StyledComponents';
import DataTable from './DataTable';
import ShowPendingTask from './ShowPendingTask';
import {
  useGetFavouritesListQuery,
} from '../../../redux/RTK/homePageSettingsApi';
import { useSelector } from 'react-redux';
import { useGetLabelsQuery } from '../../../redux/RTK/moduleDataApi';

import useWindowDimension from '../../../hooks/useWindowDimension';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import styled from 'styled-components';
import { map } from 'jquery';

export const StyledDivider = styled(Divider)`
  width: 0px !important;
  height: 30px !important;
  border-left: 1px solid #99cde6 !important;
  opacity: 1 !important;
`;

const columns = [
  { id: 'Level', translationId: 'MM_HPS_Level' },
  { id: 'ModifiedBy', translationId: 'MM_HPS_AddedEditedBy' },
  { id: 'ModifiedDate', translationId: 'MM_HPS_AddedEditedDate' },

];

const FavouritesList = () => {
  const { t } = useTranslation();
  const [roleMenu, setRoleMenu] = useState();
  const [filteredRecords, setFilteredRecords] = useState([]);
  const { isMobile, isTablet } = useWindowDimension();
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);


  const { data: labels = [], isFetching: isFetchingLabels } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const {
    data: FavouritesListData,
    refetch,
    isFetching: isFetchingApplicationRoleData,
  } = useGetFavouritesListQuery(
    {
      loginUserId: userDetails?.UserId,
    },
    {
      skip: !userDetails?.UserId,
      refetchOnMountOrArgChange: true,
    }
  );
  const { Records } = FavouritesListData || {
    Records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(Records?.map(item => {
      if (!item.ModifiedBy) {
        item = {
          ...item,
          ModifiedDate: null
        }
      } else item
      return item
    }) || [])]);
  }, [Records]);


  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);


  useEffect(() => {
    if (selectedFacility?.id) refetch();
  }, [selectedFacility?.id]);

  return (
    <FlexContainer
      width={isMobile || isTablet ? '250px' : '100%'}
      height={isMobile || isTablet ? '250px' : '100%'}
      flexDirection="column"
      padding={isMobile || isTablet ? '15px' : '0'}
    >
      <FlexContainer padding="0 0 15px 0">
        <StyledTypography
          fontSize={isMobile || isTablet ? '24px' : '36px'}
          fontWeight="900"
          lineHeight={isMobile || isTablet ? '32px' : '44px'}
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_HomePageSettings')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer
        // height={isMobile || isTablet ? '800px' : '100%'}
        width={isMobile || isTablet ? '250px' : '100%'}
        // padding="15px 25px 25px 25px"
        padding="50px 25px 25px 25px"

        borderRadius="8px"
        flexDirection="column"
        backgroundColor="#fff"
      >
        {isFetchingApplicationRoleData || isFetchingLabels ? (
          <FlexContainer justifyContent="center">
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRecords}
            labels={labels}
            isView={roleMenu?.IsView}
          />
        )}
        <ShowPendingTask />
      </FlexContainer>
      <FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default FavouritesList;


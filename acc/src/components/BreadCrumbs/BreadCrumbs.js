import React from 'react';
import styled from 'styled-components';
import { Link, Typography, Breadcrumbs } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { routeToNameMapping } from './BreadCrumbsMapping';
import HomeIcon from '../../assets/Icons/blue/home.png';
import { StyledImage } from '../../utils/StyledComponents';

const BreadcrumbsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 25px;
  gap: 15px;
  background-color: rgba(0, 131, 192, 0.05);
  width: 100%;
  height: 40px;
`;

const BreadcrumbContainer = styled(Breadcrumbs)`
  font-size: 1px;
  color: #6e6e6e;
`;

const StyledLink = styled(Link)`
  color: #2196f3; 
  text-decoration: none !important; 
  &:hover {
    text-decoration: underline !important; 
`;

const CurrentPage = styled(Typography)`
  color: #000000;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
`;

const CustomBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <BreadcrumbsContainer>
      <BreadcrumbContainer separator=">">
      <StyledLink
          component={RouterLink}
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center', // Aligns icon and text in the same row
            textDecoration: 'none',
            gap: '8px', // Adds spacing between icon and text
          }}
        >
          <StyledImage
            src={HomeIcon}
            alt="Home"
            width="14px"
            height="14px"
            style={{ verticalAlign: 'middle' }}
          />
          {routeToNameMapping['/']}
        </StyledLink>
        {/* {pathnames.length > 0 ? (
          <StyledLink
            component={RouterLink}
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center', // Aligns icon and text in the same row
              textDecoration: 'none',
              gap: '8px', // Adds spacing between icon and text
            }}
          >
            <StyledImage
              src={HomeIcon}
              alt="Home"
              width="14px"
              height="14px"
              style={{ verticalAlign: 'middle' }}
            />
            {routeToNameMapping['/']}
          </StyledLink>
        ) : (
          <>
          <CurrentPage>  
             <StyledImage
              src={HomeIcon}
              alt="Home"
              width="14px"
              height="14px"
              style={{ verticalAlign: 'middle' }}
            />
            <span> {routeToNameMapping['/']}</span>
           </CurrentPage>
          <StyledLink
          component={RouterLink}
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center', // Aligns icon and text in the same row
            textDecoration: 'none',
            gap: '8px', // Adds spacing between icon and text
          }}
        >
          <StyledImage
            src={HomeIcon}
            alt="Home"
            width="14px"
            height="14px"
            style={{ verticalAlign: 'middle' }}
          />
          {routeToNameMapping['/']}
        </StyledLink>
        </>
        )} */}
        {/* {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <CurrentPage key={to}>{routeToNameMapping[to]}</CurrentPage>
          ) : (
            <StyledLink key={to} component={RouterLink} to={to}>
              {routeToNameMapping[to]}
            </StyledLink>
          );
        })} */}
      </BreadcrumbContainer>
    </BreadcrumbsContainer>
  );
};

export default CustomBreadcrumbs;

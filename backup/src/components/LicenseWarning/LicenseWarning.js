import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import Marquee from 'react-fast-marquee';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice';
import { showLicenseToastAlert, showSweetAlert } from '../../utils/SweetAlert';
import LicenseGif from '../../assets/Gifs/LicenseExpiredfGif.gif';
import Warning from '../../assets/Icons/warning.png';
import { setIsWarning } from '../../redux/features/auth/authSlice';

const LicenseWarning = ({ licenseData, expiryDate, today, setIsPadding }) => {
  document.querySelectorAll('.custom-toast').forEach((toast) => {
    toast.style.top = '60px';
    toast.style.width = '100%';
    toast.style.overflow = 'hidden';
    toast.style.backgroundColor = '#F7C500';
    toast.style.color = 'black';
    toast.style.padding = '15px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
    toast.style.zIndex = '9999';
  });
  const [warningDisplayed, setWarningDisplayed] = useState(false);
  const dispatch = useDispatch();
  const { isSuperAdmin, userDetails, isWarning } = useSelector(
    (state) => state.auth
  );
  const checkWordExists = (text, word) => {
    const regex = new RegExp(`\\w*${word}\\w*`, 'i'); // Matches the word inside other words
    return regex.test(text);
  };
  const calculateDaysToExpire = (expireDate) => {
    if (!expireDate) return 0; // Handle undefined case

    const today = new Date();
    const expirationDate = new Date(expireDate);

    // Calculate the difference in milliseconds
    const diffInMs = expirationDate.getTime() - today.getTime();

    // Convert milliseconds to days
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  };
  useEffect(() => {
    let logoutTimeout;
    if (userDetails?.ApplicableRoles?.length > 0) {
      const checkRole = userDetails?.ApplicableRoles.map((item) => {
        return {
          ...item,
          ApplicationRole: item?.ApplicationRole?.toLowerCase(),
        };
      }).find((findItem) =>
        checkWordExists(findItem?.ApplicationRole, 'admin')
      );

      if (
        checkRole &&
        isWarning &&
        licenseData &&
        licenseData?.IsActive &&
        licenseData?.DaysToExpire > 0 &&
        licenseData?.DaysToExpire <= 30
      ) {
        showSweetAlert({
          type: 'warning',
          title: 'License Expiry Alert!',
          text: `Your license will expire in <span style="color: red; font-weight: bold;">${licenseData?.DaysToExpire} days</span>. Please renew it to continue using the application without interruption`,
          timer: 5000,
          gif: LicenseGif,
          // confirmButtonText: isSuperAdmin ? 'Yes, Renew My License!' : '',
        });
        dispatch(setIsWarning(false));
      }
    }
    const formattedDate = expiryDate.toLocaleDateString('en-GB');
    if (
      expiryDate < today &&
      licenseData &&
      isWarning &&
      (!licenseData?.IsActive || licenseData?.DaysToExpire <= 0)
    ) {
      setIsPadding(isWarning);
      showLicenseToastAlert({
        type: 'warning',
        title: 'License Expired!',
        text: `Your Product License Has Expired on <span>${formattedDate}</span>`,
        gif: Warning,
        position: 'top',
        customClass: 'custom-toast',
        width: 'auto',
        setIsPadding,
      });
      dispatch(setIsWarning(false));
    } else if (
      licenseData &&
      isWarning &&
      (!licenseData?.IsActive || licenseData?.DaysToExpire <= 0)
      // &&
      // !warningDisplayed
    ) {
      setIsPadding(isWarning);
      showLicenseToastAlert({
        type: 'warning',
        title: 'License Expired!',
        text: `Warning!Product License Will Expire in <span>${calculateDaysToExpire(licenseData?.ExpiryDate)} day(s)</span>`,
        gif: Warning,
        position: 'top',
        customClass: 'custom-toast',
        width: 'auto',
        setIsPadding,
        // confirmButtonText: isSuperAdmin ? 'Yes, Renew My License!' : '',
      });
      dispatch(setIsWarning(false));
      // setWarningDisplayed(true);
      if (!isSuperAdmin)
        logoutTimeout = setTimeout(() => {
          dispatch(logout());
        }, 3000);
    }
    return () => clearTimeout(logoutTimeout);
  }, [licenseData]);

  return (
    <div>
      {licenseData?.IsAlert && (
        <Marquee gradient={true} speed={50}>
          <Typography variant="h6" color="error">
            Your license is due to expire soon. Please renew it to avoid
            interruption.
          </Typography>
        </Marquee>
      )}
    </div>
  );
};

export default LicenseWarning;

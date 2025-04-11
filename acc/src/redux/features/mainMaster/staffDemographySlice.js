import { createSlice } from '@reduxjs/toolkit';
const staffDemographySlice = createSlice({
  name: 'staffDemography',
  initialState: {
    tabs: {
      pageIndex: 0,
      pageSize: 25,
    },
    license: {
      pageIndex: 0,
      pageSize: 25,
    },
    additionalTab: {
      pageIndex: 0,
      pageSize: 25,
    },
    lifeSupportCertification: {
      pageIndex: 0,
      pageSize: 25,
    },
    verificationStatus: {
      pageIndex: 0,
      pageSize: 25,
    },
    verificationStatusPassedByHR: {
      pageIndex: 0,
      pageSize: 25,
    },
  },
  reducers: {
    setTabsPageIndex: (state, { payload }) => {
      state.tabs.pageIndex = payload;
    },
    setTabsPageSize: (state, { payload }) => {
      state.tabs.pageSize = payload;
    },

    setLicensePageIndex: (state, { payload }) => {
      state.license.pageIndex = payload;
    },
    setLicensePageSize: (state, { payload }) => {
      state.license.pageSize = payload;
    },

    setAdditionalTabPageIndex: (state, { payload }) => {
      state.additionalTab.pageIndex = payload;
    },
    setAdditionalTabPageSize: (state, { payload }) => {
      state.additionalTab.pageSize = payload;
    },

    setLifeSupportCertificationPageIndex: (state, { payload }) => {
      state.lifeSupportCertification.pageIndex = payload;
    },
    setLifeSupportCertificationPageSize: (state, { payload }) => {
      state.lifeSupportCertification.pageSize = payload;
    },

    setVerificationStatusPageIndex: (state, { payload }) => {
      state.verificationStatus.pageIndex = payload;
    },
    setVerificationStatusPageSize: (state, { payload }) => {
      state.verificationStatus.pageSize = payload;
    },

    setVerificationStatusPassedByHRPageIndex: (state, { payload }) => {
      state.verificationStatusPassedByHR.pageIndex = payload;
    },
    setVerificationStatusPassedByHRPageSize: (state, { payload }) => {
      state.verificationStatusPassedByHR.pageSize = payload;
    },
  },
});

export const {
  setTabsPageIndex,
  setTabsPageSize,

  setLicensePageIndex,
  setLicensePageSize,

  setAdditionalTabPageIndex,
  setAdditionalTabPageSize,

  setLifeSupportCertificationPageIndex,
  setLifeSupportCertificationPageSize,

  setVerificationStatusPageIndex,
  setVerificationStatusPageSize,

  setVerificationStatusPassedByHRPageIndex,
  setVerificationStatusPassedByHRPageSize,
} = staffDemographySlice.actions;

export default staffDemographySlice.reducer;

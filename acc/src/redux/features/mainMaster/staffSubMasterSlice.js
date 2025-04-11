import { createSlice } from '@reduxjs/toolkit';
import PhysicianLevelList from '../../../features/MainMaster/StaffMaster/StaffSubMaster/PhysicianLevelList';

const staffSubMasterSlice = createSlice({
  name: 'staffSubMaster',
  initialState: {
    loading: false,
    error: null,
    records: [],
    labelDetails: [],
    employmentType: { pageIndex: 0, pageSize: 25 },
    staffCategory: { pageIndex: 0, pageSize: 25 },
    physicianLevel: { pageIndex: 0, pageSize: 25 },
    employmentSubType: { pageIndex: 0, pageSize: 25 },
  },
  reducers: {
    setEmpTypePageIndex: (state, { payload }) => {
      state.employmentType.pageIndex = payload;
    },
    setEmpTypePageSize: (state, { payload }) => {
      state.employmentType.pageSize = payload;
    },
    setStaffCategoryPageIndex: (state, { payload }) => {
      state.staffCategory.pageIndex = payload;
    },
    setStaffCategoryPageSize: (state, { payload }) => {
      state.staffCategory.pageSize = payload;
    },
    setPhysicianLevelPageIndex: (state, { payload }) => {
      state.physicianLevel.pageIndex = payload;
    },
    setPhysicianLevelPageSize: (state, { payload }) => {
      state.physicianLevel.pageSize = payload;
    },
    setEmpSubTypePageIndex: (state, { payload }) => {
      state.employmentSubType.pageIndex = payload;
    },
    setEmpSubTypePageSize: (state, { payload }) => {
      state.employmentSubType.pageSize = payload;
    },
  },
});

export const {
  setEmpTypePageIndex,
  setEmpTypePageSize,
  setStaffCategoryPageIndex,
  setStaffCategoryPageSize,
  setPhysicianLevelPageIndex,
  setPhysicianLevelPageSize,
  setEmpSubTypePageIndex,
  setEmpSubTypePageSize,
} = staffSubMasterSlice.actions;
export default staffSubMasterSlice.reducer;

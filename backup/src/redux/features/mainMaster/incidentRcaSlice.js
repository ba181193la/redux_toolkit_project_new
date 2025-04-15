import { createSlice } from '@reduxjs/toolkit';

const incidentRcaSlice = createSlice({
  name: 'incidentRca',
  initialState: {
    isFilterApplied: false,
    filters: {
      pageIndex: 0,
      pageSize: 25,
      headerFacilityId: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      incidentId: 0,
      incidentDetailId: 0,
      facilityId: '',
      incidentTypeId: 0,
      incidentRiskLevelId: 0,
        },
        teamTableData: [],
        eventTableData: [],
        rootTableData: [],
        mailToTableData: [],
        fishBoneAttachmentData: {},
        attachmentData: [],
        QuestionAnswersData: [],
        currentIndex: 0,
  },
  reducers: {
    setFilters: (state, { payload }) => {
      state.filters = payload;
    },
    resetFilters: (state) => {
      state.filters = {
        pageIndex: 0,
      pageSize: 25,
      headerFacilityId: '',
      loginUserId: '',
      moduleId: '',
      menuId: '',
      incidentId: 0,
      incidentDetailId: 0,
      facilityId: '',
      incidentTypeId: 0,
      incidentRiskLevelId: 0,
      };
      state.isFilterApplied = false;
    },
    setIsFilterApplied: (state, { payload }) => {
      state.isFilterApplied = payload;
    },
    setTeamTableData: (state, { payload }) => {
      state.teamTableData = payload; 
    },
    setEventTableData: (state, { payload }) => {
      state.eventTableData = payload; 
    },
    setRootTableData: (state, { payload }) => {
      state.rootTableData = payload; 
    },
    setMailToTableData: (state, { payload }) => {
      state.mailToTableData = payload; 
    },
    setFishBoneAttachmentData: (state, { payload }) => {
      state.fishBoneAttachmentData = payload; 
    },
    setQuestionAnswersData: (state, { payload }) => {
      state.QuestionAnswersData = payload; 
    },
    setAttachmentData: (state, { payload }) => {
      state.attachmentData = payload;
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    
    
    
  },
});

export const {
  setFilters,
  resetFilters,
  setIsFilterApplied,
  setTeamTableData,
  setEventTableData,
  setRootTableData,
  setMailToTableData,
  setFishBoneAttachmentData,
  setQuestionAnswersData,
  setCurrentIndex,
  setAttachmentData
 
} = incidentRcaSlice.actions;

export default incidentRcaSlice.reducer;

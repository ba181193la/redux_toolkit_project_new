import { createSlice } from '@reduxjs/toolkit';

const reportIncidentSlice = createSlice({
  name: 'reportIncident',
  initialState: {
    incidentStaffInvolved:null,
    incidentPatientInvolved:null,
    incidentVisitorInvolved:null,
    incidentRelativeInvolved:null,
    incidentOutStaffInvolved:null,
    incidentOthersInvolved:null,
    IncidentData:{},
    pageLoadData:null,
    staffDetails:null
  },
  reducers: {
    setIncidentStaffInvolved: (state, { payload }) => {        
      state.incidentStaffInvolved = payload;
    },
    setIncidentPatientInvolved: (state, { payload }) => {
        state.incidentPatientInvolved = payload;
      },
      setIncidentVisitorInvolved: (state, { payload }) => {
        state.incidentVisitorInvolved = payload;
      },

      setIncidentRelativeInvolved: (state, { payload }) => {
        state.incidentRelativeInvolved = payload;
      },
      setIncidentOutStaffInvolved: (state, { payload }) => {
        state.incidentOutStaffInvolved = payload;
      },
      setIncidentOthersInvolved: (state, { payload }) => {
        state.incidentOthersInvolved = payload;
      },
      setIncidentData:(state, { payload })=>{
        state.IncidentData = payload;
      },
      setPageLoadData:(state, { payload })=>{
        state.pageLoadData = payload;
      },
      setStaffDetails:(state, { payload })=>{
        state.staffDetails = payload;
      }
  },
});

export const {
    setIncidentStaffInvolved,
    setIncidentPatientInvolved,
    setIncidentVisitorInvolved,
    setIncidentRelativeInvolved,
    setIncidentOutStaffInvolved,
    setIncidentOthersInvolved,
    setIncidentData,
    setPageLoadData,
    setStaffDetails
} = reportIncidentSlice.actions;
export default reportIncidentSlice.reducer;

import React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";

const IncidentRiskTable_Cl = ({ RiskLevelData }) => {
    console.log("consequenceLevel_Print", RiskLevelData)
  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
      <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
        {/* Table Title */}
        <Typography variant="h6" align="center" sx={{ padding: 2 }}>
           Incident Risk Level
        </Typography>

        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#c0c0c0" }}>
              <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black" }}>S.No</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black" }}>Incident Risk Level</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black" }}>Action to be Taken</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black" }}>Score Range</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black" }}>RCA required</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {RiskLevelData?.Records?.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="center" sx={{ border: "1px solid black" }}>{index + 1}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>{item.IncidentRiskLevel || "N/A"}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>{item.ActionToBeTaken || "N/A"}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>{item.ScoreRange || "N/A"}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>{item.IsRCARequired || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IncidentRiskTable_Cl;

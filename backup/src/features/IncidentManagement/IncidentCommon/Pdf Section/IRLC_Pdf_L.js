import React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";

const IncidentRiskTable_l = ({ LikelihoodData }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
      <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
        {/* Table Title */}
        <Typography variant="h6" align="center" sx={{ padding: 2 }}>
          Likelihood
        </Typography>

        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#c0c0c0" }}>
              <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black" }}>S.No</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black" }}>Likelihood</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black" }}>Definition</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid black" }}>Score</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {LikelihoodData?.Records?.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="center" sx={{ border: "1px solid black" }}>{index + 1}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>{item.Likelihood || "N/A"}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>{item.LikelihoodDefinition || "N/A"}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>{item.Score || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IncidentRiskTable_l;

'use client'

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Container, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const GoldCalculator = () => {
  const [price, setPrice] = useState(2501); // B3
  const [currencyRate, setCurrencyRate] = useState(83.95); // B7

  const calculateValues = (isTRQ995) => {
    const B4 = 32.12; // 1 kg in troy ounce
    const totalValueUSD = B4 * price;

    const importDuty = (totalValueUSD * currencyRate) * 5 / 100; // 5% Duty
    const iibxTotalCharges = currencyRate * 14;
    const brokerageCharges = currencyRate * 7.5;
    const ifscaFees = ((10 / 1000000) * totalValueUSD) * currencyRate;
    const gstOnCharges = (iibxTotalCharges + brokerageCharges + ifscaFees) * 18 / 100;
    const totalChargesWithDuty = importDuty + iibxTotalCharges + brokerageCharges + ifscaFees + gstOnCharges;
    const totalKgPriceINR = totalChargesWithDuty + (totalValueUSD * currencyRate);

    const per10gmPriceINR = totalKgPriceINR / 100;
    const withGST = per10gmPriceINR * 1.03; // 3% GST
    const per10gmChargesWithGST = per10gmPriceINR + withGST;

    return {
      importDuty,
      iibxTotalCharges,
      brokerageCharges,
      ifscaFees,
      gstOnCharges,
      totalChargesWithDuty,
      totalKgPriceINR,
      per10gmPriceINR,
      withGST,
      per10gmChargesWithGST
    };
  };

  const valuesTRQ999 = calculateValues(false);
  const valuesTRQ995 = calculateValues(true);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gold Price Calculator</Typography>
      <TextField
        label="IIBX Gold Price (B3)"
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Currency Rate (B7)"
        type="number"
        value={currencyRate}
        onChange={(e) => setCurrencyRate(Number(e.target.value))}
        fullWidth
        margin="normal"
      />



      <Box display="flex" justifyContent="space-between">

        <Box flex={1} p={1}>
          <Typography variant="h5" gutterBottom>999 TRQ Table</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#1976d2' }}>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', padding: '10px' }}>Parameter</TableCell>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', padding: '10px' }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Import Duty</TableCell>
                  <TableCell>{valuesTRQ999.importDuty.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IIBX Total Charges</TableCell>
                  <TableCell>{valuesTRQ999.iibxTotalCharges.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brokerage Charges</TableCell>
                  <TableCell>{valuesTRQ999.brokerageCharges.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IFSCA Fees</TableCell>
                  <TableCell>{valuesTRQ999.ifscaFees.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>GST on Charges</TableCell>
                  <TableCell>{valuesTRQ999.gstOnCharges.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Charges with Duty</TableCell>
                  <TableCell>{valuesTRQ999.totalChargesWithDuty.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total 1kg Gold Price in INR</TableCell>
                  <TableCell>{valuesTRQ999.totalKgPriceINR.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per 10gm Price INR</TableCell>
                  <TableCell>{valuesTRQ999.per10gmPriceINR.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>With 3% GST</TableCell>
                  <TableCell>{valuesTRQ999.withGST.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per 10gm Charges with GST</TableCell>
                  <TableCell>{valuesTRQ999.per10gmChargesWithGST.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box flex={1} p={1}>
          <Typography variant="h5" gutterBottom>995 TRQ Table</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#1976d2' }}>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', padding: '10px' }}>Parameter</TableCell>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', padding: '10px' }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Import Duty</TableCell>
                  <TableCell>{valuesTRQ995.importDuty.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IIBX Total Charges</TableCell>
                  <TableCell>{valuesTRQ995.iibxTotalCharges.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brokerage Charges</TableCell>
                  <TableCell>{valuesTRQ995.brokerageCharges.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IFSCA Fees</TableCell>
                  <TableCell>{valuesTRQ995.ifscaFees.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>GST on Charges</TableCell>
                  <TableCell>{valuesTRQ995.gstOnCharges.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Charges with Duty</TableCell>
                  <TableCell>{valuesTRQ995.totalChargesWithDuty.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total 1kg Gold Price in INR</TableCell>
                  <TableCell>{valuesTRQ995.totalKgPriceINR.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per 10gm Price INR</TableCell>
                  <TableCell>{valuesTRQ995.per10gmPriceINR.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>With 3% GST</TableCell>
                  <TableCell>{valuesTRQ995.withGST.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Per 10gm Charges with GST</TableCell>
                  <TableCell>{valuesTRQ995.per10gmChargesWithGST.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

      </Box>



    </Container>
  );
};

export default GoldCalculator;

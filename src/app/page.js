'use client'

import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import logo from '../../public/logo.webp'; // Adjust the path as needed

import { Container, Box, Button, TextField, Typography, Table, Switch, FormControlLabel , TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const fetcher = (url) => fetch(url).then((res) => res.json());

function GoldPriceCalculator() {

  const { data, error }  = useSWR('/config.json', fetcher);

  const [goldPriceB3, setGoldPriceB3]                         = useState(2500);
  const [currencyRateB7, setCurrencyRateB7]                   = useState(85);
  const [goldCustomDutyPrice, setgoldCustomDutyPrice]         = useState(800);
  const [goldCustomsExchangeRate, setgoldCustomsExchangeRate] = useState(85);
  const [goldCustomPriceDate, setGoldCustomPriceDate]         = useState("30/08/2024");
  const [goldCustomsExchangeDate, setGoldCustomsExchangeDate] = useState("17/08/2024");
  const [isTRQHolder, setIsTRQHolder]                         = useState(true);

  // Calculate the 5% import duty based on G12 and G14 inputs
  const importDuty5Percent = (goldCustomsExchangeRate * goldCustomDutyPrice * 100) * 0.05;
  const importDuty6Percent = (goldCustomsExchangeRate * goldCustomDutyPrice * 100) * 0.06;



  const getTotalCustomDuty = () => {
    return goldCustomDutyPrice* goldCustomsExchangeRate;
  }

  const getCustomsImportDuty = () => {
    if( isTRQHolder ){
      return goldCustomDutyPrice* goldCustomsExchangeRate * 0.05;
    }else{
      return goldCustomDutyPrice* goldCustomsExchangeRate * 0.06;
    }
  }

  const calculateValues = (trq) => {

    let troyOunce = 31.99
    if(trq == 999){
      troyOunce = 32.12;
    }

    const totalValueUSD         = troyOunce * goldPriceB3 ; 
    const totalValueINR         = totalValueUSD * currencyRateB7; // Use the 5% import duty value

    const iibxTotalCharges      = currencyRateB7 * 14;
    const brokerageCharges      = currencyRateB7 * 7.5;
    const ifscaFees             = 0.00001 * totalValueUSD * currencyRateB7;
    const gstOnCharges          = (iibxTotalCharges + brokerageCharges + ifscaFees) * 0.18;

    let importDuty = importDuty5Percent;
    if ( ! isTRQHolder ){
      importDuty = importDuty6Percent
    }

    const totalChargesWithDuty = importDuty + iibxTotalCharges + brokerageCharges + ifscaFees + gstOnCharges;
    
    const total1KgGoldPriceINR  = totalChargesWithDuty + totalValueINR;
    const per10gmPriceINR       = total1KgGoldPriceINR / 100;
    const per10gmWithGst        = per10gmPriceINR  + (getTotalCustomDuty() + getCustomsImportDuty())*0.03;

    return {
      troyOunce,
      importDuty,
      totalValueINR,
      totalValueUSD,
      iibxTotalCharges,
      brokerageCharges,
      ifscaFees,
      gstOnCharges,
      totalChargesWithDuty,
      total1KgGoldPriceINR,
      per10gmPriceINR,
      per10gmWithGst,
    };
  };
  
  const handleToggle = () => {
    setIsTRQHolder(!isTRQHolder);
  };

  useEffect(() => {
    if (data) {
      setgoldCustomDutyPrice(data.importDuty);
      setgoldCustomsExchangeRate(data.exchangeRate);
      setGoldCustomPriceDate(data.importDutyDate);
      setGoldCustomsExchangeDate(data.exchangeRateDate)
    }
  }, [data]);

  const values999 = calculateValues(999);
  const values995 = calculateValues(995);

  if (error) return <div>Failed to load</div>;

  if (!data) return <div>Loading...</div>;


  return (
    <Container>

      <Box sx={{ backgroundColor: '#0f284b', color: 'white', padding: '2px', borderRadius: '8px' }}>
        <br/>

        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4" gutterBottom> &nbsp; IIBX Gold Price Calculator</Typography>
          <Link href="https://www.anandrathigiftcity.com" passHref>
            <Image
              src={logo}
              alt="Anand Rathi"
              width={180}
              height={60}
              style={{ cursor: 'pointer',  padding: '5px', }} // Add cursor pointer for better UX
            />
          </Link>
        </Box>
      </Box>

      <hr></hr>
      <Box display="flex" justifyContent="space-between">
          <Box>
            <Box flex={4} p={1}>
              <TextField
                label="IIBX Gold Price"
                variant="outlined"
                fullWidth
                type="number"
                value={goldPriceB3}
                onChange={(e) => setGoldPriceB3(e.target.value)}
              />
            </Box>
            <Box flex={1} p={1}>
              <TextField
                label="Currency Rate"
                variant="outlined"
                fullWidth
                type="number"
                value={currencyRateB7}
                onChange={(e) => setCurrencyRateB7(e.target.value)}
              />
            </Box>
            <Box mt={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isTRQHolder}
                    onChange={handleToggle}
                    name="toggleSwitch"
                    color="primary"
                  />
                }
                label={isTRQHolder ? 'TRQ Holder ( 5% ) ' : 'NON-TRQ Holder ( 6% ) '}
              />
            </Box>
            <br/><br/><br/>
            <Box display="flex" alignItems="center" sx={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
              <Link href="https://www.anandrathigiftcity.com/contact-us.php" passHref>
                <Box display="flex"   justifyContent="space-between"  sx={{ cursor: 'pointer', textDecoration: 'none', flexGrow: 1 }}>
                  <Typography variant="body1">
                    To Start your IIBX journey ...
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      marginLeft: '10px',
                      backgroundColor: 'darkblue',
                      color: 'white',
                      '&:hover': { backgroundColor: 'blue' },
                    }}
                  >
                    Click Here !!
                  </Button>
                </Box>
              </Link>
            </Box>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#000000' }}>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>GOLD Custom Duty </TableCell>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow style={{ backgroundColor: '#FFFFF0', borderBottom: '2px solid #000000' }}>
                  <TableCell>Import Duty as CBIC {goldCustomPriceDate} on 10gm </TableCell>
                  <TableCell>
                  $ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(goldCustomDutyPrice.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#FFFFF0',  borderBottom: '2px solid #000000'}}>
                  <TableCell>Customs exchange rate on {goldCustomsExchangeDate} </TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(goldCustomsExchangeRate.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#FFFFF0', borderBottom: '2px solid #000000' }}>
                  <TableCell>Total Value for 10gm  </TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(getTotalCustomDuty())}
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#FFFFF0', borderBottom: '2px solid #000000' }} >
                  <TableCell>Import duty for 10gm </TableCell>
                  <TableCell>
                    ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(getCustomsImportDuty())}
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#FFFFF0', borderBottom: '2px solid #000000' }} >
                  <TableCell>3% GST on Gold Value ( 10gm ) </TableCell>
                  <TableCell>
                    ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format( (getTotalCustomDuty() + getCustomsImportDuty())*0.03 )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <hr></hr>


      <br></br>
      <Box display="flex" justifyContent="space-between">
        <Box flex={1} p={1}>
          <Typography variant="h5" gutterBottom>995 TRQ Table</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#1976d2' }}>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Parameter</TableCell>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Value</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>IIBX Gold price ( per Ounce )</TableCell>
                  <TableCell>{goldPriceB3}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Troy Ounce ( per Kg )</TableCell>
                  <TableCell>{values995.troyOunce.toFixed(2)}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Total value in USD ( per Kg )</TableCell>
                  <TableCell> $ {values995.totalValueUSD.toFixed(2)}</TableCell>
                </TableRow>

                <TableRow style={{ border: '2px solid black ' , borderBottom: '2px solid #000000' }}>
                  <TableCell>Total value in INR ( per Kg )</TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values995.totalValueINR.toFixed(2))}
                  </TableCell>
                </TableRow>

                <TableRow >
                  <TableCell>Import Duty ( per Kg ) </TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values995.importDuty.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IIBX Total Charges ( per Kg ) </TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values995.iibxTotalCharges.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brokerage Charges</TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values995.brokerageCharges.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IFSCA Fees</TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values995.ifscaFees.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>GST on Charges</TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values995.gstOnCharges.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow  style={{  border: '2px solid black ' , borderBottom: '2px solid #000000' }}>
                  <TableCell>Total Charges with Duty ( per Kg ) </TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values995.totalChargesWithDuty.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total 1kg Gold Price </TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values995.total1KgGoldPriceINR.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#FFFFF0'}}>
                  <TableCell>Total 10gm Price </TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values995.per10gmPriceINR.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#FFFFF0', border: '1px solid black bottom' , borderBottom: '2px solid #000000' }} >
                  <TableCell>Final Price with 3% GST ( 10gm )</TableCell>
                  <TableCell>
                    ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values995.per10gmWithGst)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box flex={1} p={1}>
          <Typography variant="h5" gutterBottom>999 TRQ Table</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#1976d2' }}>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Parameter</TableCell>
                  <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Value</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>IIBX Gold price ( per Ounce )</TableCell>
                  <TableCell>{goldPriceB3}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Troy Ounce ( per Kg )</TableCell>
                  <TableCell>{values999.troyOunce.toFixed(2)}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Total value in USD ( per Kg )</TableCell>
                  <TableCell>$ {values999.totalValueUSD.toFixed(2)}</TableCell>
                </TableRow>

                <TableRow style={{ border: '2px solid black ' , borderBottom: '2px solid #000000' }}>
                  <TableCell>Total value in INR ( per Kg )</TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values999.totalValueINR.toFixed(2))}
                  </TableCell>
                </TableRow>

                <TableRow >
                  <TableCell>Import Duty ( per Kg ) </TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values999.importDuty.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IIBX Total Charges ( per Kg ) </TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values999.iibxTotalCharges.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brokerage Charges</TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values999.brokerageCharges.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IFSCA Fees</TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values999.ifscaFees.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>GST on Charges</TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values999.gstOnCharges.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow  style={{  border: '2px solid black ' , borderBottom: '2px solid #000000' }}>
                  <TableCell>Total Charges with Duty ( per Kg )</TableCell>
                  <TableCell>
                    ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values999.totalChargesWithDuty.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total 1kg Gold Price in INR</TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values999.total1KgGoldPriceINR.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow  style={{ backgroundColor: '#FFFFF0'}}>
                  <TableCell>Total 10gm Price INR</TableCell>
                  <TableCell>
                  ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values999.per10gmPriceINR.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: '#FFFFF0', border: '1px solid black bottom' , borderBottom: '2px solid #000000' }} >
                  <TableCell>Final Price with 3% GST ( 10gm )</TableCell>
                  <TableCell>
                    ₹ {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(values999.per10gmWithGst)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" sx={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
        <Link href="https://www.anandrathigiftcity.com/contact-us.php" passHref>
          <Box display="flex" alignItems="center" sx={{ cursor: 'pointer', textDecoration: 'none', flexGrow: 1 }}>
            <Typography variant="body1">
              To Start your IIBX journey ...
            </Typography>
            <Button
              variant="contained"
              sx={{
                marginLeft: '10px',
                backgroundColor: 'darkblue',
                color: 'white',
                '&:hover': { backgroundColor: 'blue' },
              }}
            >
              Click Here !!
            </Button>
          </Box>
        </Link>
      </Box>
    </Container>
  );
}

export default GoldPriceCalculator;

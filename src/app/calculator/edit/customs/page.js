'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
} from '@mui/material';

const EditConfig = () => {
    
  const [config, setConfig] = useState({
    importDuty: '',
    importDutyDate: '',
    exchangeRate: '',
    exchangeRateDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        setError('Failed to load config data');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        alert('Config updated successfully');
      } else {
        throw new Error('Failed to update config');
      }
    } catch (err) {
      setError('Failed to save config');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Edit Custom Duty
        </Typography>


        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Import Duty"
              type="number"
              name="importDuty"
              value={config.importDuty}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Import Duty Date"
              type="date"
              name="importDutyDate"
              value={config.importDutyDate.split('/').reverse().join('-')} // Convert to YYYY-MM-DD for input
              onChange={(e) => {
                const formattedDate = e.target.value.split('-').reverse().join('/');
                handleChange({ target: { name: 'importDutyDate', value: formattedDate } });
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Exchange Rate"
              type="number"
              name="exchangeRate"
              step="0.01"
              value={config.exchangeRate}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Exchange Rate Date"
              type="date"
              name="exchangeRateDate"
              value={config.exchangeRateDate.split('/').reverse().join('-')}
              onChange={(e) => {
                const formattedDate = e.target.value.split('-').reverse().join('/');
                handleChange({ target: { name: 'exchangeRateDate', value: formattedDate } });
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Save Config
            </Button>
          </Grid>
          <br></br>
          <Grid container spacing={2}>
            <Typography variant="h6" align="center" sx={{ margin: 2 }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'blue' }}>
                &nbsp; &nbsp; Go back to Home Page
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>




    </Container>
  );
};

export default EditConfig;

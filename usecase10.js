import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  CircularProgress,
  Container,
  Typography,
  TextField,
} from '@mui/material';
 
const Evolution = () => {
  const [initialFile, setInitialFile] = useState(null);
  const [finalFile, setFinalFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleInitialFileChange = (event) => {
    setInitialFile(event.target.files[0]);
  };
 
  const handleFinalFileChange = (event) => {
    setFinalFile(event.target.files[0]);
  };
 
  const analyzeRequirements = async () => {
    if (!initialFile || !finalFile) {
      setError('Please select both initial and final files.');
      return;
    }
 
    setError('');
    setLoading(true);
 
    const formData = new FormData();
    formData.append('initial_requirements', initialFile);
    formData.append('final_requirements', finalFile);
 
    try {
      const response = await axios.post(
        'http://bookshop.eastus.cloudapp.azure.com:8082/api/evolution',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
 
      setAnalysisResults(response.data.analysis_results);
    } catch (error) {
      setError('Error processing analysis. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <Container
      maxWidth="sm"
      style={{
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1>Evolution</h1>
      <label
        htmlFor="initialFileInput"
        style={{ marginBottom: '10px', width: '60%', textAlign: 'center' }}
      >
        <input
          id="initialFileInput"
          type="file"
          onChange={handleInitialFileChange}
          accept=".pdf, .doc, .docx"
          style={{ display: 'none' }}
        />
        <Button
          variant="contained"
          color="primary"
          component="span"
          style={{ width: '100%' }}
        >
          Choose Initial Requirements File
        </Button>
      </label>
      <label
        htmlFor="finalFileInput"
        style={{ marginBottom: '10px', width: '60%', textAlign: 'center' }}
      >
        <input
          id="finalFileInput"
          type="file"
          onChange={handleFinalFileChange}
          accept=".pdf, .doc, .docx"
          style={{ display: 'none' }}
        />
        <Button
          variant="contained"
          color="primary"
          component="span"
          style={{ width: '100%' }}
        >
          Choose Final Requirements File
        </Button>
      </label>
      {initialFile && finalFile && (
        <Typography variant="body1">
          Selected Initial File: {initialFile.name}
          <br />
          Selected Final File: {finalFile.name}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={analyzeRequirements}
        style={{ width: '40%' }}
      >
        Analyze
      </Button>
      {loading && <CircularProgress style={{ marginTop: '10px' }} />}
      {error && (
        <Typography variant="body1" color="error" style={{ marginTop: '10px' }}>
          Error: {error}
        </Typography>
      )}
      {analysisResults && (
        <div style={{ marginTop: '20px', width: '100%' }}>
          <Typography variant="h6" style={{ marginBottom: '10px', textAlign: 'center' }}>
            Analysis Results:
          </Typography>
          <TextField
            multiline
            variant="outlined"
            fullWidth
            value={analysisResults}
            InputProps={{
              readOnly: true,
              style: {
                width: '100%',
                textAlign: 'justify',
                whiteSpace: 'pre-line',
              },
            }}
          />
        </div>
      )}
    </Container>
  );
};
 
export default Evolution;
 
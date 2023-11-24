import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material'; // Import CircularProgress from Material-UI
 
// Styling objects
const styles = {
  container: {
    backgroundColor: '#333',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    marginBottom: '15px',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
  },
  button: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: '15px',
    fontSize: '14px',
  },
  explanation: {
    marginTop: '20px',
    color: 'white',
    textAlign: 'left',
  },
};
 
function CodeExplanation() {
  const [inputCode, setInputCode] = useState('');
  const [codeExplanation, setCodeExplanation] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const handleInputChange = (e) => {
    setInputCode(e.target.value);
  };
 
  const explainCode = () => {
    setLoading(true);
 
    axios
      .post('http://bookshop.eastus.cloudapp.azure.com:8082/api/check_code', { input_code: inputCode })
      .then((response) => {
        setCodeExplanation(response.data.code_explanation);
        setError(null);
      })
      .catch((error) => {
        setError('Error: Unable to retrieve code explanation from the server.');
        setCodeExplanation('');
      })
      .finally(() => {
        setLoading(false);
      });
  };
 
  return (
    <div style={styles.container} className="code-explanation-container">
      <h1>Code Security Checker</h1>
      <div>
        <textarea
          style={styles.input}
          placeholder="Enter code to check"
          rows="10"
          value={inputCode}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div>
        <button style={styles.button} onClick={explainCode}>
          {loading ? 'Checking...' : 'Check Code'}
        </button>
      </div>
      <div>
        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          <div>
            {error && <p style={styles.error}>{error}</p>}
            {codeExplanation && (
              <div style={styles.explanation}>
                <h2>Code Explanation:</h2>
                {/* Split codeExplanation into separate lines */}
                {codeExplanation.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
 
function Security() {
  return (
    <div style={{ backgroundColor: '#333', color: 'white', minHeight: '100vh' }}>
      <CodeExplanation />
    </div>
  );
}
 
export default Security;
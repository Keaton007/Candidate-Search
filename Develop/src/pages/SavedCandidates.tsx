import { useState } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>(
    JSON.parse(localStorage.getItem('savedCandidates') || '[]')
  );

  const handleRemoveCandidate = (login: string) => {
    const updatedCandidates = savedCandidates.filter((candidate) => candidate.login !== login);
    setSavedCandidates(updatedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Saved Candidates</h1>

      {savedCandidates.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#cbe957' }}>No saved candidates yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#2c2c2c', borderRadius: '10px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#444', color: 'white' }}>
              <th style={tableHeaderStyle}>Avatar</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Username</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Company</th>
              <th style={tableHeaderStyle}>GitHub Profile</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedCandidates.map((candidate) => (
              <tr key={candidate.login} style={tableRowStyle}>
                <td style={tableCellStyle}>
                  <img 
                    src={candidate.avatar_url} 
                    alt={candidate.login} 
                    width={50} 
                    style={{ borderRadius: '50%', boxShadow: '0px 3px 6px rgba(0,0,0,0.3)' }} 
                  />
                </td>
                <td style={tableCellStyle}>{candidate.name || 'N/A'}</td>
                <td style={tableCellStyle}>{candidate.login}</td>
                <td style={tableCellStyle}>{candidate.email || 'N/A'}</td>
                <td style={tableCellStyle}>{candidate.company || 'N/A'}</td>
                <td style={tableCellStyle}>
                  <a 
                    href={candidate.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#cbe957', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    GitHub Profile
                  </a>
                </td>
                <td style={tableCellStyle}>
                  <button 
                    onClick={() => handleRemoveCandidate(candidate.login)} 
                    style={removeButtonStyle}
                  >
                    –
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const tableHeaderStyle = {
  padding: '10px',
  textAlign: 'left' as const,
  fontWeight: 'bold',
};

const tableRowStyle = {
  borderBottom: '1px solid #555',
  backgroundColor: '#3a3a3a',
};

const tableCellStyle = {
  padding: '10px',
  textAlign: 'left' as const,
};

const removeButtonStyle = {
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  fontSize: '20px',
  fontWeight: 'bold',
  border: 'none',
  backgroundColor: '#d9534f',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.3)',
  transition: 'transform 0.2s ease-in-out',
};

export default SavedCandidates;

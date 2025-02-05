import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>(
    JSON.parse(localStorage.getItem('savedCandidates') || '[]')
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const users = await searchGithub();
        console.log('Fetched users:', users);

        if (users.length > 0) {
          const candidateData = await searchGithubUser(users[0].login);
          console.log('Fetched candidate details:', candidateData);

          if (candidateData && candidateData.login) {
            setCandidates(users.slice(1));
            setCurrentCandidate(candidateData);
          } else {
            console.warn('No valid candidate data found.');
            setCurrentCandidate(null);
          }
        } else {
          console.warn('No users returned from API.');
          setCurrentCandidate(null);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setCurrentCandidate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleSaveCandidate = () => {
    if (currentCandidate) {
      const updatedSaved = [...savedCandidates, currentCandidate];
      setSavedCandidates(updatedSaved);
      localStorage.setItem('savedCandidates', JSON.stringify(updatedSaved));
    }
    handleNextCandidate();
  };

  const handleNextCandidate = async () => {
    if (candidates.length > 0) {
      const nextUser = candidates[0];
      console.log('Fetching next candidate:', nextUser.login);
      
      const candidateData = await searchGithubUser(nextUser.login);
      if (candidateData && candidateData.login) {
        setCandidates(candidates.slice(1));
        setCurrentCandidate(candidateData);
      } else {
        console.warn('No valid data for next candidate.');
        setCurrentCandidate(null);
      }
    } else {
      setCurrentCandidate(null);
    }
  };

  return (
    <div>
      <h1>Candidate Search</h1>
      {loading ? (
        <p>Loading candidates...</p>
      ) : currentCandidate ? (
        <div style={{ 
          border: '1px solid #444', 
          borderRadius: '15px', 
          padding: '25px', 
          textAlign: 'center', 
          width: '400px', 
          height: '550px', // Increased height to prevent overlap
          margin: '20px auto', 
          position: 'relative', 
          backgroundColor: '#2c2c2c', 
          color: 'white', 
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between' // Ensures proper spacing
        }}>
          <div>
            <img 
              src={currentCandidate.avatar_url} 
              alt={currentCandidate.login} 
              width={120} 
              style={{ borderRadius: '50%', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)' }} 
            />
            <h2 style={{ margin: '10px 0' }}>{currentCandidate.name || 'N/A'}</h2>
            <p><strong>Username:</strong> {currentCandidate.login}</p>
            <p><strong>Location:</strong> {currentCandidate.location || 'Unknown'}</p>
            <p><strong>Email:</strong> {currentCandidate.email || 'N/A'}</p>
            <p style={{ wordWrap: 'break-word', maxWidth: '90%' }}>
              <strong>Company:</strong> {currentCandidate.company || 'N/A'}
            </p>
            <a 
              href={currentCandidate.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-block', 
                marginTop: '10px', 
                color: '#cbe957', 
                textDecoration: 'none', 
                fontWeight: 'bold' 
              }}
            >
              GitHub Profile
            </a>
          </div>
        
          {/* Buttons remain at the bottom */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '0 30px', 
            marginBottom: '15px' // Added spacing from the bottom
          }}>
            <button 
              onClick={handleNextCandidate} 
              style={{ 
                borderRadius: '50%', 
                width: '70px', 
                height: '70px', 
                fontSize: '35px', 
                fontWeight: 'bold', 
                border: 'none', 
                backgroundColor: '#d9534f', 
                color: 'white', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', 
                transition: 'transform 0.2s ease-in-out' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              –
            </button>
        
            <button 
              onClick={handleSaveCandidate} 
              style={{ 
                borderRadius: '50%', 
                width: '70px', 
                height: '70px', 
                fontSize: '35px', 
                fontWeight: 'bold', 
                border: 'none', 
                backgroundColor: '#5cb85c', 
                color: 'white', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', 
                transition: 'transform 0.2s ease-in-out' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              +
            </button>
          </div>
        </div>        
      ) : (
        <p>No more candidates available.</p>
      )}
    </div>
  );
};

export default CandidateSearch;

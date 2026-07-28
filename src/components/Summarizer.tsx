import { useState } from 'react';

export default function Summarizer() {
  const [inputText, setInputText] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This function runs when you click the "Summarize" button
  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setSummaryResult('');

    try {
      // Send the text to your FastAPI backend at port 8000
      const response = await fetch('http://127.0.0.1:8000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      // Store the AI summary in state so it displays on screen
      setSummaryResult(data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummaryResult('Failed to connect to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>AI Text Summarizer</h2>
      
      {/* Input Text Box */}
      <textarea rows={4}
        style={{ width: '100%', padding: '10px' }}
        placeholder="Paste your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      {/* Button to Trigger AI */}
      <button
        onClick={handleSummarize}
        disabled={isLoading}
        style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}
      >
        {isLoading ? 'Summarizing...' : 'Get AI Summary'}
      </button>

      {/* Box displaying the result */}
      {summaryResult && (
        <div style={{ marginTop: '20px', background: '#f0f0f0', padding: '15px' }}>
          <h3>Result:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{summaryResult}</p>
        </div>
      )}
    </div>
  );
}
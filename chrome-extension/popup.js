document.addEventListener('DOMContentLoaded', function() {
  const registrationInput = document.getElementById('registration');
  const submitButton = document.getElementById('submit');
  const resultDiv = document.getElementById('result');
  const valuationP = document.getElementById('valuation');
  const errorDiv = document.getElementById('error');

  submitButton.addEventListener('click', function() {
    const registration = registrationInput.value.trim().toUpperCase();
    if (registration.length === 0) {
      showError('Please enter a registration number.');
      return;
    }

    fetch('https://dealergen.netlify.app/.netlify/functions/vehicle-valuation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registration }),
    })
    .then(response => {
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      return response.text().then(text => {
        console.log('Raw response:', text);
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error(`Invalid JSON: ${text}`);
        }
      });
    })
    .then(data => {
      console.log('Parsed data:', data);
      if (data.retailValuation) {
        showResult(data.retailValuation);
      } else {
        showError(data.error || 'Vehicle not found or valuation not available.');
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      showError('An error occurred while fetching the valuation. Please try again later.');
    });
  });

  function showResult(valuation) {
    resultDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    valuationP.textContent = `£${valuation.toLocaleString()}`;
  }

  function showError(message) {
    resultDiv.classList.add('hidden');
    errorDiv.classList.remove('hidden');
    errorDiv.querySelector('p').textContent = message;
  }
});
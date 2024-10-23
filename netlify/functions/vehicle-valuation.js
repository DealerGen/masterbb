exports.handler = async function(event, context) {
  console.log('Function invoked');
  console.log('Event:', JSON.stringify(event));
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    console.log('Parsing request body');
    const { registration } = JSON.parse(event.body);
    console.log('Received registration:', registration);

    if (!registration) {
      console.log('No registration provided');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Registration number is required.' })
      };
    }

    const mockDatabase = [
      { id: 'YH22VFD', retailValuation: 25000 },
      { id: 'AB12CDE', retailValuation: 15000 },
      { id: 'KU18FWD', retailValuation: 18000 },
    ];

    console.log('Searching for car');
    const car = mockDatabase.find(car => car.id.toUpperCase() === registration.toUpperCase());

    if (car && car.retailValuation) {
      console.log('Car found:', car);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ retailValuation: car.retailValuation }),
      };
    } else {
      console.log('Car not found');
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Vehicle not found or valuation not available.' }),
      };
    }
  } catch (error) {
    console.error('Error in function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'An error occurred while processing the request.' }),
    };
  }
};
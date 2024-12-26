const axios = require('axios');

const baseURL = 'https://api.pokemongohub.net/v1/';

axios.get(`${baseURL}best/attackers`)
    .then(response => {
        console.log('Top Attackers:', response.data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

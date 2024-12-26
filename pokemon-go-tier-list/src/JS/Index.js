document.addEventListener('DOMContentLoaded', () => {
    axios.get(`${baseURL}pokemon`)
        .then(response => {
            const pokemonList = response.data;
            const listElement = document.getElementById('pokemon-list');
            pokemonList.forEach(pokemon => {
                const pokemonElement = document.createElement('div');
                pokemonElement.textContent = pokemon.name;
                listElement.appendChild(pokemonElement);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

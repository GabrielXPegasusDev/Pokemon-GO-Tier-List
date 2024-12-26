document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.pokemongohub.net/v1/pokemon')
        .then(response => response.json())
        .then(data => {
            const listElement = document.getElementById('pokemon-list');
            data.forEach(pokemon => {
                const pokemonElement = document.createElement('div');
                pokemonElement.textContent = pokemon.name;
                listElement.appendChild(pokemonElement);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

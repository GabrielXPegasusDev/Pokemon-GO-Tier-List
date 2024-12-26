async function fetchPokemonData() {
    const response = await fetch('./latest.json'); // Load the local JSON file
    const data = await response.json();
    return data;
}

function calculateMaxCP(baseAttack, baseDefense, baseStamina) {
    const cpMultiplier = 0.7903001; // Level 50 multiplier
    return Math.floor(
        ((baseAttack + 15) * 
        Math.sqrt(baseDefense + 15) * 
        Math.sqrt(baseStamina + 15) * 
        Math.pow(cpMultiplier, 2)) / 10
    );
}

async function displayPokemonMaxCP() {
    const pokemonData = await fetchPokemonData();
    const resultsDiv = document.getElementById('pokemon-list');

    pokemonData.forEach(pokemon => {
        const baseAttack = pokemon.base_attack;
        const baseDefense = pokemon.base_defense;
        const baseStamina = pokemon.base_stamina;
        const maxCP = calculateMaxCP(baseAttack, baseDefense, baseStamina);

        const pokemonDiv = document.createElement('div');
        pokemonDiv.innerHTML = `<strong>${pokemon.name}</strong>: Max CP at Level 50 = ${maxCP}`;
        resultsDiv.appendChild(pokemonDiv);
    });
}

displayPokemonMaxCP();
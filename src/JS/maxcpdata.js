document.addEventListener('DOMContentLoaded', () => {
    // CP Multiplier for max level 50
    const cpMultiplier = 0.7903001;

    // Function to fetch and display Pokémon data
    const fetchPokemonData = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1302');
            const data = await response.json();
            const pokemonList = await Promise.all(
                data.results.map(async (pokemon, index) => {
                    const pokeResponse = await fetch(pokemon.url);
                    const pokeData = await pokeResponse.json();

                    const baseAttack = pokeData.stats[1].base_stat;
                    const baseDefense = pokeData.stats[2].base_stat;
                    const baseStamina = pokeData.stats[0].base_stat;

                    // Calculate maximum values
                    const maxAttack = baseAttack + 15;
                    const maxDefense = baseDefense + 15;
                    const maxStamina = baseStamina + 15;
                    const maxHP = Math.floor(baseStamina * cpMultiplier);

                    // Calculate Max CP
                    const maxCP = Math.floor(
                        ((maxAttack) * Math.sqrt(maxDefense) * Math.sqrt(maxStamina) * Math.pow(cpMultiplier, 2)) / 10
                    );

                    return {
                        index: index + 1,
                        name: pokeData.name,
                        maxCP: maxCP,
                        maxHP: maxHP,
                        maxStamina: maxStamina,
                        maxAttack: maxAttack,
                        maxDefense: maxDefense
                    };
                })
            );

            // Sort Pokémon by Max CP
            pokemonList.sort((a, b) => b.maxCP - a.maxCP);

            let tableData = '';
            for (const pokemon of pokemonList) {
                tableData += `
                    <tr>
                        <td>${pokemon.index}</td>
                        <td>${pokemon.name}</td>
                        <td>${pokemon.maxCP}</td>
                        <td>${pokemon.maxHP}</td>
                        <td>${pokemon.maxStamina}</td>
                        <td>${pokemon.maxAttack}</td>
                        <td>${pokemon.maxDefense}</td>
                    </tr>`;
            }

            document.getElementById('tableData').innerHTML = tableData;
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    };

    fetchPokemonData();
});

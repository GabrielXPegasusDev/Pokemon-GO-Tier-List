document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch and display Pokémon data
    const fetchPokemonData = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1302');
            const data = await response.json();
            const pokemonList = data.results;

            let tableData = '';
            for (const [index, pokemon] of pokemonList.entries()) {
                const pokeResponse = await fetch(pokemon.url);
                const pokeData = await pokeResponse.json();

                const baseAttack = pokeData.stats[1].base_stat;
                const baseDefense = pokeData.stats[2].base_stat;
                const baseStamina = pokeData.stats[0].base_stat;

                // Calculate Max CP
                const maxCP = Math.floor(
                    ((baseAttack + 15) *
                    Math.sqrt(baseDefense + 15) *
                    Math.sqrt(baseStamina + 15) *
                    Math.pow(0.7903001, 2)) / 10
                );

                tableData += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${pokeData.name}</td>
                        <td>${maxCP}</td>
                        <td>${baseStamina}</td>
                        <td>${baseAttack}</td>
                        <td>${baseDefense}</td>
                    </tr>`;
            }

            document.getElementById('tableData').innerHTML = tableData;
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    };

    fetchPokemonData();
});

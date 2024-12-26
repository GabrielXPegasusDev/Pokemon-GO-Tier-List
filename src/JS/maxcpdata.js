async function fetchPokemonData() {
    const response = await fetch('https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json'); // Load data from the new API
    const data = await response.json();
    return data; // Return the full data
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

function calculateMaxHP(baseStamina, cpMultiplier) {
    return Math.floor(baseStamina * cpMultiplier);
}

function calculateStatWithPerfectIV(baseStat) {
    return baseStat + 15; // Adding perfect IVs
}

async function displayPokemonMaxCP() {
    const pokemonData = await fetchPokemonData();
    const resultsDiv = document.getElementById('tableData');
    const cpMultiplier = 0.7903001; // Level 50 multiplier
    const processedPokemons = new Set(); // Set to track processed Pokémon
    const pokemonList = []; // Array to store all Pokémon data

    const excludedForms = ['COPY', '2019', 'SPRING', 'SUMMER', 'WINTER', 'FALL', 'COSTUME'];

    pokemonData.forEach(pokemon => {
        if (pokemon && pokemon.stats) { // Check if pokemon and stats exist
            const baseAttack = pokemon.stats.attack;
            const baseDefense = pokemon.stats.defense;
            const baseStamina = pokemon.stats.stamina;

            const maxCP = calculateMaxCP(baseAttack, baseDefense, baseStamina);
            const maxHP = calculateMaxHP(baseStamina, cpMultiplier);
            const maxStamina = calculateStatWithPerfectIV(baseStamina);
            const maxAttack = calculateStatWithPerfectIV(baseAttack);
            const maxDefense = calculateStatWithPerfectIV(baseDefense);

            // Use provided name and form for display
            const displayName = pokemon.formId && pokemon.formId !== pokemon.id
                ? `${pokemon.names.English} (${pokemon.formId.replace('_', ' ')})`
                : pokemon.names.English;

            // Track processed Pokémon by a combination of id and formId
            const uniqueId = `${pokemon.dexNr}-${pokemon.id}-${pokemon.formId || 'default'}`;

            // Add Pokémon only if it hasn't been processed yet and not an excluded form
            if (!processedPokemons.has(uniqueId) && !excludedForms.some(form => uniqueId.includes(form))) {
                processedPokemons.add(uniqueId);

                // Store Pokémon data in the list
                pokemonList.push({
                    dexNr: pokemon.dexNr,
                    name: displayName,
                    maxCP,
                    maxHP,
                    maxStamina,
                    maxAttack,
                    maxDefense
                });
            }

            // Check for mega evolutions and calculate their stats
            if (pokemon.megaEvolutions) {
                for (const megaKey in pokemon.megaEvolutions) {
                    const mega = pokemon.megaEvolutions[megaKey];
                    const megaBaseAttack = mega.stats.attack;
                    const megaBaseDefense = mega.stats.defense;
                    const megaBaseStamina = mega.stats.stamina;

                    const megaMaxCP = calculateMaxCP(megaBaseAttack, megaBaseDefense, megaBaseStamina);
                    const megaMaxHP = calculateMaxHP(megaBaseStamina, cpMultiplier);
                    const megaMaxStamina = calculateStatWithPerfectIV(megaBaseStamina);
                    const megaMaxAttack = calculateStatWithPerfectIV(megaBaseAttack);
                    const megaMaxDefense = calculateStatWithPerfectIV(megaBaseDefense);

                    const megaDisplayName = mega.names.English;
                    const megaUniqueId = `${pokemon.dexNr}-${pokemon.id}-${mega.id}`;

                    // Add Mega Evolution only if it hasn't been processed yet and not an excluded form
                    if (!processedPokemons.has(megaUniqueId) && !excludedForms.some(form => megaUniqueId.includes(form))) {
                        processedPokemons.add(megaUniqueId);

                        // Store Mega Evolution data in the list
                        pokemonList.push({
                            dexNr: pokemon.dexNr,
                            name: megaDisplayName,
                            maxCP: megaMaxCP,
                            maxHP: megaMaxHP,
                            maxStamina: megaMaxStamina,
                            maxAttack: megaMaxAttack,
                            maxDefense: megaMaxDefense
                        });
                    }
                }
            }

            // Check for regional forms and calculate their stats
            if (pokemon.assetForms) {
                pokemon.assetForms.forEach(form => {
                    // Check if it's a regional form and not a costume form
                    if (form.costume || excludedForms.some(excludedForm => form.form && form.form.includes(excludedForm))) {
                        return; // Skip costume forms and specific unwanted forms
                    }

                    const formBaseAttack = form.stats ? form.stats.attack : baseAttack;
                    const formBaseDefense = form.stats ? form.stats.defense : baseDefense;
                    const formBaseStamina = form.stats ? form.stats.stamina : baseStamina;

                    const formMaxCP = calculateMaxCP(formBaseAttack, formBaseDefense, formBaseStamina);
                    const formMaxHP = calculateMaxHP(formBaseStamina, cpMultiplier);
                    const formMaxStamina = calculateStatWithPerfectIV(formBaseStamina);
                    const formMaxAttack = calculateStatWithPerfectIV(formBaseAttack);
                    const formMaxDefense = calculateStatWithPerfectIV(formBaseDefense);

                    const formDisplayName = form.form
                        ? `${pokemon.names.English} (${form.form.replace('_', ' ')})`
                        : pokemon.names.English;
                    const formUniqueId = `${pokemon.dexNr}-${pokemon.id}-${form.form || 'default'}`;

                    // Add form only if it hasn't been processed yet and not an excluded form
                    if (!processedPokemons.has(formUniqueId) && !excludedForms.some(excludedForm => formUniqueId.includes(excludedForm))) {
                        processedPokemons.add(formUniqueId);

                        // Store form data in the list
                        pokemonList.push({
                            dexNr: pokemon.dexNr,
                            name: formDisplayName,
                            maxCP: formMaxCP,
                            maxHP: formMaxHP,
                            maxStamina: formMaxStamina,
                            maxAttack: formMaxAttack,
                            maxDefense: formMaxDefense
                        });
                    }
                });
            }
        }
    });

    // Sort the Pokémon list by Max CP (descending)
    pokemonList.sort((a, b) => b.maxCP - a.maxCP);

    // Display the sorted Pokémon list
    pokemonList.forEach(pokemon => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pokemon.dexNr}</td>
            <td>${pokemon.name}</td>
            <td>${pokemon.maxCP}</td>
            <td>${pokemon.maxHP}</td>
            <td>${pokemon.maxStamina}</td>
            <td>${pokemon.maxAttack}</td>
            <td>${pokemon.maxDefense}</td>
        `;
        resultsDiv.appendChild(row);
    });

    // Store initial sort order
    const table = document.querySelector('.table-sortable');
    table.setAttribute('data-sort-direction', 'desc'); // Initially sorted in descending order
}

function sortTable(columnIndex) {
    const table = document.querySelector(".table-sortable");
    const rows = Array.from(table.querySelectorAll("tbody tr")); // Select all table rows inside tbody
    const isNumeric = columnIndex !== 1; // Assume all columns except 'Name' are numeric

    const currentOrder = table.getAttribute('data-sort-direction');
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order

    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].innerText;
        const cellB = rowB.cells[columnIndex].innerText;

        const valueA = isNumeric ? parseFloat(cellA) : cellA.toLowerCase();
        const valueB = isNumeric ? parseFloat(cellB) : cellB.toLowerCase();

        if (newOrder === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });

    rows.forEach(row => table.querySelector('tbody').appendChild(row));
    table.setAttribute('data-sort-direction', newOrder); // Update sort direction
}

document.addEventListener('DOMContentLoaded', () => {
    displayPokemonMaxCP().then(() => {
        sortTable(2, desc); // Sort by Max CP in descending order by default
    });
});

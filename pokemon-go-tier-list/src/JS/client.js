document.addEventListener('DOMContentLoaded', () => {
    const baseURL = 'https://api.pokemongohub.net/v1/';
    const attackersList = document.getElementById('attackers-list');

    fetch(`${baseURL}best/attackers`)
        .then(response => response.json())
        .then(data => {
            data.forEach(attacker => {
                const attackerElement = document.createElement('div');
                attackerElement.textContent = `${attacker.name} - Attack: ${attacker.attack}`;
                attackersList.appendChild(attackerElement);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

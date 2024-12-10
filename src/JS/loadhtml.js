// IncludeHTML function
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      file = elmnt.getAttribute("pokeinclude");
      if (file) {
          xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4) {
                  if (this.status == 200) {
                      elmnt.innerHTML = this.responseText;
                  }
                  if (this.status == 404) {
                      elmnt.innerHTML = "Page not found.";
                  }
                  elmnt.removeAttribute("pokeinclude");
                  includeHTML();
              }
          }
          xhttp.open("GET", file, true);
          xhttp.send();
          return;
      }
  }
}

window.onload = () => {
  includeHTML();
  loadTableData(pokemonData);
};

function loadTableData(pokemonData) {
  const tableBody = document.getElementById('tableData');
  let dataHtml = '';

  for (let pokemon of pokemonData) {
      dataHtml += '<tr><td class="dex">' + pokemon.pokemon_id + '</td><td class="name">' + pokemon.pokemon_name + '</td><td class="cp">' + pokemon.cp + '</td><td>' + pokemon.buddy + '</td></tr>';
  }

  tableBody.innerHTML = dataHtml;
}

function sortColumn(columnName) {
  const dataType = typeof pokemonData[0][columnName];
  sortDirection = !sortDirection;

  switch (dataType) {
      case 'number':
          sortNumberColumn(sortDirection, columnName);
          break;
      // Add cases for other data types if necessary
  }

  loadTableData(pokemonData);
}

function sortNumberColumn(sort, columnName) {
  pokemonData = pokemonData.sort((p1, p2) => {
      return sort ? p1[columnName] - p2[columnName] : p2[columnName] - p1[columnName];
  });
}

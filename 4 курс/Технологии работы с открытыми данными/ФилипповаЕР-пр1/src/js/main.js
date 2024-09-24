document.addEventListener('DOMContentLoaded', () => {
  const scoreContainer = document.getElementById('score-container');
  const teamsContainer = document.getElementById('teams-container');
  const tableContainer = document.getElementById('table-container');

  // Загрузка данных из файла db.json
  fetch('db.json')
      .then(response => response.json())
      .then(data => {
          // Создаем и добавляем информацию о счете
          const scoreDiv = document.createElement('div');
          scoreDiv.classList.add('text-center', 'mb-4');
          scoreDiv.innerHTML = `<h2>Счет: ${data.игра.счет.команда_1} - ${data.игра.счет.команда_2}</h2>`;
          scoreContainer.appendChild(scoreDiv);

          // Создаем и добавляем информацию о членах команд
          const teamsDiv = document.createElement('div');
          teamsDiv.classList.add('row', 'mb-4');

          const team1Div = document.createElement('div');
          team1Div.classList.add('col-md-6');
          team1Div.innerHTML = `<h3>${data.игра.команда_1.название}</h3><ul>${data.игра.команда_1.игроки.map(player => `<li>${player}</li>`).join('')}</ul>`;

          const team2Div = document.createElement('div');
          team2Div.classList.add('col-md-6');
          team2Div.innerHTML = `<h3>${data.игра.команда_2.название}</h3><ul>${data.игра.команда_2.игроки.map(player => `<li>${player}</li>`).join('')}</ul>`;

          teamsDiv.appendChild(team1Div);
          teamsDiv.appendChild(team2Div);
          teamsContainer.appendChild(teamsDiv);

          // Создаем и добавляем таблицу с голами
          const table = document.createElement('table');
          table.classList.add('table', 'table-bordered');

          const thead = document.createElement('thead');
          const tbody = document.createElement('tbody');

          const headerRow = document.createElement('tr');
          const headers = ['Минута', 'Команда', 'Автор гола'];
          headers.forEach(headerText => {
              const th = document.createElement('th');
              th.textContent = headerText;
              headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);

          data.игра.голы.forEach(goal => {
              const row = document.createElement('tr');
              const minuteCell = document.createElement('td');
              minuteCell.textContent = goal.минута;
              const teamCell = document.createElement('td');
              teamCell.textContent = goal.команда;
              const authorCell = document.createElement('td');
              authorCell.textContent = goal.автор;

              row.appendChild(minuteCell);
              row.appendChild(teamCell);
              row.appendChild(authorCell);

              tbody.appendChild(row);
          });

          table.appendChild(thead);
          table.appendChild(tbody);

          tableContainer.appendChild(table);
      })
      .catch(error => console.error('Ошибка при загрузке данных:', error));
});

const express = require('express');
const app = express();
const port = 8000;
const fs = require('fs');
const bodyParser = require('body-parser'); // Модуль для парсинга JSON

app.use(express.static('public'));
app.use(bodyParser.json()); // Парсим JSON-запросы

// Массив для хранения пользовательских данных (вместо базы данных)
const userRecords = [];

app.get('/', (req, res) => {
  fs.readFile(__dirname + '/public/index.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.send(data);
  });
});

// Маршрут для создания нового пользователя
app.post('/api/users', (req, res) => {
  const newUser = req.body; // Получаем данные из тела запроса

  // Проверяем, что пользователь с таким email еще не существует
  const isDuplicate = userRecords.some(record => record.email === newUser.email);
  if (isDuplicate) {
    return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
  }

  // Добавляем нового пользователя в массив
  userRecords.push(newUser);

  // Возвращаем нового пользователя в ответе
  res.status(201).json(newUser);
});

// Маршрут для обновления данных пользователя по ID
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id); // Получаем ID пользователя из URL
  const updatedUser = req.body; // Получаем обновленные данные из тела запроса

  // Находим пользователя по ID
  const userToUpdate = userRecords.find(user => user.id === userId);

  if (!userToUpdate) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  // Обновляем данные пользователя
  userToUpdate.email = updatedUser.email;
  userToUpdate.password = updatedUser.password;

  // Возвращаем обновленного пользователя в ответе
  res.json(userToUpdate);
});

// Маршрут для удаления пользователя по ID
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id); // Получаем ID пользователя из URL

  // Находим пользователя по ID
  const userIndexToDelete = userRecords.findIndex(user => user.id === userId);

  if (userIndexToDelete === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  // Удаляем пользователя из массива
  userRecords.splice(userIndexToDelete, 1);

  res.sendStatus(204); // Отправляем успешный статус без содержимого
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

# Student-db-manager

## Запуск сервиса Бэкенда

### Генерация документации swagger

```bash
swag init
```

Просмотр документации будет доступен по адресу <http://localhost:8080/docs/index.html>.

### Запуск сервиса

```bash
go run main.go
```

### Переменные окружения

| Переменная окружения | Описание | Значение по умолчанию |
|----------------|-------------|------------------------|
| STDB_HOST      | Адрес хоста сервиса  |  0.0.0.0 |
| STDB_PORT      | Адрес порта сервиса  | 8080 |
| STDB_PROXY     | Доверенный прокси по умолчанию  | 127.0.0.1 |
| DB_NAME     | Имя базы данных  | students_registry |
| DB_HOST  | Адрес хоста базы данных  | localhost |
| DB_PORT      | Адрес порта базы данных  | 5434 |
| DB_USER      | Пользователь базы данных  | postgres |
| DB_PASSWORD  | Пароль базы данных  | admin |

### Done list

- [ ] /students_page -- баг с факультетом :)
- [ ] /add_student
- [x] /student_card
- [ ] /update_student
- [x] /archive_student
- [x] /delete_student
- [ ] /add_qualification_work
- [x] /professors
- [x] /faculties
- [x] /departments

### TODO

- Уровень логирования + logrus
- Нормальная валидация входных данных и убрать говнокод с этим связанный
- Кривая передача TypeOf в template-функцию (не понимаю как в golang с таким работать)

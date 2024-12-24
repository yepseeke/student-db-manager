package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"reflect"
	"strconv"

	"github.com/gin-gonic/gin"
)

// @Summary Список студентов
// @Description Вывести спискок студентов для отображения на странице
// @Accept json
// @Produce json
// @Param page query int false "Номер страницы" default(1)
// @Param pageSize query int false "Число студентов на странице" default(20)
// @Param depatmentId query int false "Фильтрация по ID кафедры"
// @Param facultyId query int false "Фильтрация по ID факультета"
// @Param course query int false "Фильтрация по номеру курса"
// @Param order query SortOrder true "Порядок сортировки" default("ASC")
// @Success 200 {object} StudentPage
// @Failure 404 {object} ErrorResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /students_page [get]
func GetStudentsPage(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Читаем параметры запроса
		page := c.DefaultQuery("page", "")
		pageSize := c.DefaultQuery("pageSize", "")
		departmentId := c.DefaultQuery("departmentId", "")
		facultyId := c.DefaultQuery("facultyId", "")
		course := c.DefaultQuery("course", "")
		order := c.DefaultQuery("order", "ASC")

		pageNum, pageSizeNum := 1, 20
		fmt.Sscanf(page, "%d", &pageNum)
		fmt.Sscanf(pageSize, "%d", &pageSizeNum)

		baseQuery := `
		SELECT student_card_id, "name", surname, patronymic 
		FROM student
		WHERE 1 = 1
	`

		countQuery := `
		SELECT COUNT(*)
		FROM student
		WHERE 1 = 1
	`

		args := []interface{}{}
		argIndex := 1

		// Условия фильтрации
		if departmentId != "" {
			baseQuery += fmt.Sprintf(` AND department_id = $%d`, argIndex)
			countQuery += fmt.Sprintf(` AND department_id = $%d`, argIndex)
			args = append(args, departmentId)
			argIndex++
		}
		if facultyId != "" {
			baseQuery += fmt.Sprintf(` AND faculty_id = $%d`, argIndex)
			countQuery += fmt.Sprintf(` AND faculty_id = $%d`, argIndex)
			args = append(args, facultyId)
			argIndex++
		}
		if course != "" {
			baseQuery += fmt.Sprintf(` AND course_id = $%d`, argIndex)
			countQuery += fmt.Sprintf(` AND course_id = $%d`, argIndex)
			args = append(args, course)
			argIndex++
		}

		// Пагинация
		offset := (pageNum - 1) * pageSizeNum
		baseQuery += fmt.Sprintf(" ORDER BY surname %s LIMIT %d OFFSET %d", order, pageSizeNum, offset)

		// Выполняем запрос для получения данных студентов
		rows, err := db.Query(baseQuery, args...)
		if err != nil {
			log.Printf("Error executing query: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch students" + baseQuery})
			return
		}
		defer rows.Close()

		// Чтение данных
		var students []StudentDetailed
		for rows.Next() {
			var s StudentDetailed
			if err := rows.Scan(&s.ID, &s.FirstName, &s.LastName, &s.Patronomyc); err != nil {
				log.Printf("Error scanning row: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse student data"})
				return
			}
			students = append(students, s)
		}

		// Обсчет числа страниц
		var count int
		err = db.QueryRow(countQuery, args...).Scan(&count)
		if err != nil {
			log.Fatal(err)
		}
		totalPages := count / pageSizeNum
		if count%pageSizeNum != 0 {
			totalPages++
		}

		// Формируем и возвращаем ответ
		response := gin.H{
			"page_num":    pageNum,
			"page_size":   pageSizeNum,
			"students":    students,
			"total_pages": totalPages,
		}

		c.JSON(http.StatusOK, response)
	}
}

// @Summary Карточка студента
// @Description Вывести карточку с подробной информаций о студенте
// @Accept json
// @Produce json
// @Param id query int true "ID студента" default(1)
// @Success 200 {object} StudentCard
// @Failure 404 {object} ErrorResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /student_card [get]
func GetStudentCard(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.DefaultQuery("id", "")

		// Validate id
		if idStr == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'id' query parameter"})
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid 'id' format. Must be an integer."})
			return
		}

		// find student
		studentQuery := "SELECT s.student_card_id, s.name, s.surname, s.patronymic, s.phone_number, s.email , d.name, f.name, s.archived\n" +
			"FROM student AS s\n" +
			"JOIN department as d\n" +
			"ON d.department_id = s.department_id\n" +
			"JOIN faculty as f\n" +
			"ON f.faculty_id = d.faculty_id\n" +
			"WHERE s.student_card_id = $1\n" +
			"LIMIT 1"
		row := db.QueryRow(studentQuery, id)
		var student StudentDetailed
		err = row.Scan(&student.ID, &student.FirstName, &student.LastName, &student.Patronomyc,
			&student.Phone, &student.Email, &student.Department, &student.Faculty, &student.Archived)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
			return
		} else if err != nil {
			log.Println("Error scanning row:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting student details"})
			return
		}

		// find qualification works
		rows, err := db.Query("SELECT work_id, p.surname || ' ' ||  p.name || ' ' ||  p.patronymic,  q.name, q.work_type, q.work_status, q.grade\n"+
			"FROM qualification_work as q JOIN professor as p ON p.professor_id = q.supervisor_id\n"+
			"WHERE q.student_card_id = $1 LIMIT 1", id)
		if err != nil {
			log.Printf("Error executing query: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch qualifiaction works"})
			return
		}
		defer rows.Close()
		var qualification_works []QualificationWork
		for rows.Next() {
			var q QualificationWork
			if err := rows.Scan(&q.ID, &q.Supervisor, &q.Name, &q.WorkType, &q.WorkStatus, &q.Grade); err != nil {
				log.Printf("Error scanning row: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse qualification work data"})
				return
			}
			qualification_works = append(qualification_works, q)
		}

		response := gin.H{
			"student":             student,
			"qualification_works": qualification_works,
		}

		c.JSON(http.StatusOK, response)
	}
}

// @Summary Добавление студента
// @Description Добавление нового студента
// @Accept json
// @Produce json
// @Param name query string true "Имя"
// @Param surname query string true "Фамилия"
// @Param patronymic query string true "Отчество"
// @Param phone_number query string false "Номер телефона"
// @Param email query string false "Адрес электронной почты"
// @Param birth_date query string true "Дата рождения" format(date)
// @Success 200
// @Router /add_student [post]
func AddStudent(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		name := c.DefaultQuery("name", "")
		surname := c.DefaultQuery("surname", "")
		patronymic := c.DefaultQuery("patronymic", "")
		phoneNumber := c.DefaultQuery("phone_number", "")
		email := c.DefaultQuery("email", "")
		birthDate := c.DefaultQuery("birth_date", "")

		baseQuery := "INSERT INTO student (surname, name, patronymic, email, phone_number, birth_date, year) VALUES ($1, $2, $3, $4, $5, $6, $7)"
		_, err := db.Exec(baseQuery, surname, name, patronymic, email, phoneNumber, birthDate, 1)
		if err != nil {
			log.Printf("Error inserting student: %s", err)
		}

		c.Status(http.StatusOK)
	}
}

// @Summary Обновление студента
// @Description Обновление информации о студенте
// @Accept json
// @Produce json
// @Param id query string true "ID студента"
// @Param name query string false "Имя"
// @Param surname query string false "Фамилия"
// @Param patronymic query string false "Отчество"
// @Param phone_number query string false "Номер телефона"
// @Param email query string false "Адрес электронной почты"
// @Param birth_date query string false "Дата рождения" format(date)
// @Success 200
// @Router /update_student [put]
func UpdateStudent(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.DefaultQuery("id", "")

		// Validate id
		if idStr == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'id' query parameter"})
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid 'id' format. Must be an integer."})
			return
		}

		// check if there is a student
		studentQuery := "SELECT COUNT(*) FROM student WHERE student_card_id = $1 AND archived = False"
		var count int
		err = db.QueryRow(studentQuery, id).Scan(&count)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Student doesnt exist or archived"})
			return
		}

		updateQuery := "UPDATE `students` SET `archived` = true WHERE `id` = $1"

		_, err = db.Exec(updateQuery, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error trying while trying update student"})
			return
		}

		c.Status(http.StatusOK)
	}
}

// @Summary Архивация студента
// @Description Архивировать студента
// @Accept json
// @Produce json
// @Param id query int true "ID студента" default(1)
// @Success 200
// @Failure 404 {object} ErrorResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /archive_student [put]
func ArchiveStudent(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.DefaultQuery("id", "")

		// Validate id
		if idStr == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'id' query parameter"})
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid 'id' format. Must be an integer."})
			return
		}

		// check if there is a student
		studentQuery := "SELECT COUNT(*) FROM student WHERE student_card_id = $1 AND archived = False"
		var count int
		err = db.QueryRow(studentQuery, id).Scan(&count)
		if count == 0 || err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "student archived or not exists"})
			return
		}

		updateQuery := "UPDATE student SET archived = true WHERE student_card_id = $1"

		_, err = db.Exec(updateQuery, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error trying while trying update student"})
			return
		}

		c.Status(http.StatusOK)
	}
}

// @Summary Удаление студента
// @Description Удалить студента
// @Accept json
// @Produce json
// @Param id query int true "ID студента" default(1)
// @Success 200
// @Failure 404 {object} ErrorResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /delete_student [delete]
func DeleteStudent(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.DefaultQuery("id", "")

		// Validate id
		if idStr == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'id' query parameter"})
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid 'id' format. Must be an integer."})
			return
		}

		updateQuery := "DELETE student WHERE student_card_id = $1"

		_, err = db.Exec(updateQuery, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error trying while trying update student"})
			return
		}

		c.Status(http.StatusOK)
	}
}

// @Summary Добавление квалификационной работы
// @Description Добавить квалификационную работу
// @Accept json
// @Produce json
// @Param student_id query int true "ID студента"
// @Param supervisor_id query int true "ID профессора"
// @Param name query string true "Наименование работы"
// @Param work_type query WorkType true "Тип работы"
// @Param work_status query WorkStatus false "Статус работы"
// @Param grade query int false "Оценка"
// @Success 200
// @Router /add_qualification_work [post]
func AddQualifiactionWork(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Status(http.StatusOK)
	}
}

// @Summary Список профессоров
// @Description Список профессоров
// @Accept json
// @Produce json
// @Success 200 {object} ProfessorList
// @Failure 404 {object} ErrorResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /professors [get]
func GetProfessors(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {
		rows, err := db.Query("SELECT surname || ' ' || name || ' ' || patronymic, professor_id, department_id FROM professor")
		if err != nil {
			log.Printf("Error executing query: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch professors"})
			return
		}
		defer rows.Close()
		var professors []Professor
		for rows.Next() {
			var p Professor
			if err := rows.Scan(&p.FullName, &p.ID, &p.DepartmentId); err != nil {
				log.Printf("Error scanning row: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse professor data"})
				return
			}
			professors = append(professors, p)
		}

		response := gin.H{
			"professors": professors,
		}

		c.JSON(http.StatusOK, response)
	}
}

// @Summary Список факультетов
// @Description Список факультетов
// @Accept json
// @Produce json
// @Success 200 {object} FacultyList
// @Failure 500 {object} ErrorResponse
// @Router /faculties [get]
func GetFaculties(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := "SELECT faculty_id, name FROM faculty"
		faculties, err := QueryToObjects[Faculty](db, query, reflect.TypeOf(Faculty{}))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		response := gin.H{
			"faculties": faculties,
		}
		c.JSON(http.StatusOK, response)
	}
}

// @Summary Список кафедр
// @Description Список кафедр
// @Accept json
// @Produce json
// @Success 200 {object} DepartmentList
// @Failure 500 {object} ErrorResponse
// @Router /departments [get]
func GetDepartments(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := "SELECT d.department_id, d.name, d.faculty_id, p.surname || ' ' || p.name || ' ' ||\n" +
			"p.patronymic FROM department AS d JOIN professor AS p ON d.department_head_id = p.professor_id"
		departments, err := QueryToObjects[Department](db, query, reflect.TypeOf(Department{}))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		response := gin.H{
			"departments": departments,
		}
		c.JSON(http.StatusOK, response)
	}
}

package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

type Student struct {
	ID            int     `json:"id"`
	FirstName     string  `json:"first_name"`
	LastName      string  `json:"last_name"`
	Patronomyc    string  `json:"patronomyc"`
	Avatar        *string `json:"avatar"`
	CourseWork    *string `json:"course_work,omitempty"` // nullable
	Department_ID *string `json:"department,omitempty"`
	Faculty       *string `json:"faculty,omitempty"`
	Email         *string `json:"email,omitempty"`
	Phone         *string `json:"phone,omitempty"`
}

func getStudents(c *gin.Context) {
	// Читаем параметры запроса
	page := c.DefaultQuery("page", "1")                    // Номер страницы
	pageSize := c.DefaultQuery("pageSize", "20")           // Размер страницы
	departmentName := c.DefaultQuery("departmentName", "") // Фильтр по кафедре
	facultyName := c.DefaultQuery("facultyName", "")       // Фильтр по факультету
	course := c.DefaultQuery("course", "")                 // Фильтр по курсу

	// Конвертация параметров в числа
	pageNum, pageSizeNum := 1, 20
	fmt.Sscanf(page, "%d", &pageNum)
	fmt.Sscanf(pageSize, "%d", &pageSizeNum)

	// Базовый SQL-запрос
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
	if departmentName != "" {
		baseQuery += fmt.Sprintf(` AND department_id IN (SELECT department_id FROM department WHERE "name" = $%d)`, argIndex)
		countQuery += fmt.Sprintf(` AND department_id IN (SELECT department_id FROM department WHERE "name" = $%d)`, argIndex)
		args = append(args, departmentName)
		argIndex++
	}
	if facultyName != "" {
		baseQuery += fmt.Sprintf(` AND faculty_id IN (SELECT faculty_id FROM faculty WHERE "name" = $%d)`, argIndex)
		countQuery += fmt.Sprintf(` AND faculty_id IN (SELECT faculty_id FROM faculty WHERE "name" = $%d)`, argIndex)
		args = append(args, facultyName)
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
	baseQuery += fmt.Sprintf(" ORDER BY surname LIMIT %d OFFSET %d", pageSizeNum, offset)

	// Получение общего количества студентов
	var total int
	err := db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		log.Printf("Error counting students: %v", err)
		c.JSON(500, gin.H{"error": "Failed to get total count"})
		return
	}

	// Выполняем запрос для получения данных студентов
	rows, err := db.Query(baseQuery, args...)
	if err != nil {
		log.Printf("Error executing query: %v", err)
		c.JSON(500, gin.H{"error": "Failed to fetch students"})
		return
	}
	defer rows.Close()

	// Чтение данных
	var students []Student
	for rows.Next() {
		var s Student
		if err := rows.Scan(&s.ID, &s.FirstName, &s.LastName, &s.Patronomyc); err != nil {
			log.Printf("Error scanning row: %v", err)
			c.JSON(500, gin.H{"error": "Failed to parse student data"})
			return
		}
		students = append(students, s)
	}

	// Формируем и возвращаем ответ
	response := gin.H{
		"total":    total,
		"page":     pageNum,
		"pageSize": pageSizeNum,
		"students": students,
	}

	c.JSON(200, response)
}

package main

import (
	"database/sql"

	_ "github.com/lib/pq"
)

const (
	DB_USER     = "postgres"
	DB_PASSWORD = "6902"
	DB_NAME     = "student_registry"
)

type Student struct {
	ID             int    `json:"ID"`
	FullName       string `json:"FullName"`
	TicketNumber   string `json:"TicketNumber"`
	EducationLevel string `json:"EducationLevel"`
	Department     string `json:"Department"`
	ThesisTitle    string `json:"ThesisTitle"`
	IsArchived     bool   `json:"IsArchived"`
}

func ConnectDB() (*sql.DB, error) {
	dbinfo := "user=" + DB_USER + " password=" + DB_PASSWORD + " dbname=" + DB_NAME + " sslmode=disable"
	db, err := sql.Open("postgres", dbinfo)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return db, nil
}

func GetStudents(db *sql.DB) ([]Student, error) {
	query := `SELECT id, full_name, student_ticket_number, education_level, department, thesis_title, is_archived FROM students`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var students []Student
	for rows.Next() {
		var s Student
		err := rows.Scan(&s.ID, &s.FullName, &s.TicketNumber, &s.EducationLevel, &s.Department, &s.ThesisTitle, &s.IsArchived)
		if err != nil {
			return nil, err
		}
		students = append(students, s)
	}
	return students, nil
}

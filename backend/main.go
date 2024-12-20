package main

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // PostgreSQL driver
)

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("postgres", "user=postgres password=6902 dbname=student_registry sslmode=disable")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	r := gin.Default()

	r.GET("/students", getStudents) // Получить список студентов
	// r.POST("/students", addStudent)            // Добавить студента
	// r.GET("/students/:id", getStudentDetails)  // Получить детали студента
	// r.PUT("/students/:id", updateStudent)      // Полностью обновить студента
	// r.PATCH("/students/:id", patchStudent)     // Частично обновить студента
	// r.DELETE("/students/:id", deleteStudent)   // Удалить студента

	r.Run(":8080")
}

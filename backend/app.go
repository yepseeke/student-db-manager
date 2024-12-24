package main

import (
	"database/sql"
	"fmt"
	"log"

	"go-app/config"
	"go-app/docs"
	"go-app/handlers"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

var db *sql.DB

// @title Student DataBase API
func main() {
	// initialize gin
	r := gin.Default()
	r.SetTrustedProxies([]string{config.GetProxy()})

	// initialize swagger
	docs.SwaggerInfo.BasePath = "/"
	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// connect to database
	var err error
	db_params := fmt.Sprintf("user=%s password=%s dbname=students_registry sslmode=disable",
		config.GetUser(), config.GetPassword())
	db, err = sql.Open("postgres", db_params)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	r.Use()
	defer db.Close()

	// endpoints
	r.GET("/students_page", handlers.GetStudentsPage(db))
	r.POST("/add_student", handlers.AddStudent(db))
	r.GET("/student_card", handlers.GetStudentCard(db))
	r.PUT("/update_student", handlers.UpdateStudent(db))
	r.PUT("/archive_student", handlers.ArchiveStudent(db))
	r.DELETE("/delete_student", handlers.DeleteStudent(db))
	r.POST("/add_qualification_work", handlers.AddQualifiactionWork(db))
	r.GET("/professors", handlers.GetProfessors(db))
	r.GET("/faculties", handlers.GetFaculties(db))
	r.GET("/departments", handlers.GetDepartments(db))

	// listen and serve
	r.Run(config.GetHostAndPort())
}

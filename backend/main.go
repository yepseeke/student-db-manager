package main

import (
	"database/sql"
	"fmt"
	"go-app/config"
	"go-app/docs"
	"log"

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
	db_params := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		config.GetDbHost(), config.GetDbPort(), config.GetUser(), config.GetPassword(), config.GetDbName())
	db, err = sql.Open("postgres", db_params)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// endpoints
	r.GET("/students_page", getStudentsPage)
	r.POST("/add_student", addStudent)
	r.GET("/student_card", getStudentCard)
	r.PUT("/update_student", updateStudent)
	r.PUT("/archive_student", archiveStudent)
	r.DELETE("/delete_student", deleteStudent)
	r.POST("/add_qualification_work", addQualifiactionWork)
	r.GET("/professors", getProfessors)
	r.GET("/faculties", getFaculties)
	r.GET("/departments", getDepartments)

	// listen and serve
	r.Run(config.GetHostAndPort())
}

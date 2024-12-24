package handlers

type SortOrder string

type WorkType string

type WorkStatus string

const (
	Asc          SortOrder  = "ASC"
	Desc         SortOrder  = "DESC"
	Course       WorkType   = "course"
	Diploma      WorkType   = "diploma"
	Master       WorkType   = "master"
	Dissertation WorkType   = "dissertation"
	Complete     WorkStatus = "complete"
	InProgress   WorkStatus = "in progress"
)

type Student struct {
	ID         int    `json:"id"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	Patronomyc string `json:"patronomyc"`
}

type StudentDetailed struct {
	ID         int     `json:"id"`
	FirstName  string  `json:"first_name"`
	LastName   string  `json:"last_name"`
	Patronomyc string  `json:"patronomyc"`
	Avatar     *string `json:"avatar"`
	Department *string `json:"department,omitempty"`
	Faculty    *string `json:"faculty,omitempty"`
	Email      *string `json:"email,omitempty"`
	Phone      *string `json:"phone,omitempty"`
	Archived   *bool   `json:"archived"`
}

type StudentPage struct {
	Students   []Student `json:"students"`
	PageNum    int       `json:"page_num"`
	PageSize   int       `json:"page_size"`
	TotalPages int       `json:"total_pages"`
}

type StudentCard struct {
	Student            StudentDetailed     `json:"student"`
	QualificationWorks []QualificationWork `json:"qualification_works"`
}

type QualificationWork struct {
	ID         int    `json:"id"`
	Supervisor string `json:"supervisor"`
	Name       string `json:"name"`
	WorkType   string `json:"work_type"`
	WorkStatus string `json:"work_status"`
	Grade      *int   `json:"grade"`
}

type Professor struct {
	ID           int    `json:"id"`
	DepartmentId int    `json:"department_id"`
	FullName     string `json:"full_name"`
}

type ProfessorList struct {
	Professors []Professor `json:"professors"`
}

type Faculty struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type FacultyList struct {
	Faculties []Faculty `json:"faculties"`
}

type Department struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	FacultyId int    `json:"faculty_id"`
	HeadName  string `json:"head_name"`
}

type DepartmentList struct {
	Departments []Department `json:"departments"`
}

type ErrorResponse struct {
	Error string `json:"error" example:"Some error info"`
}

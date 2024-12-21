DROP TABLE IF EXISTS qualification_work;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS professor CASCADE;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS faculty;
DROP TYPE IF EXISTS workstatus;
DROP TYPE IF EXISTS worktype;
DROP TYPE IF EXISTS educationstatus;
DROP TYPE IF EXISTS educationlevel;

CREATE TYPE educationlevel AS ENUM ('bachelor', 'master', 'postgraduate');
-- bachelor - бакалавр
-- master - магистр
-- postgraduate - аспирант

CREATE TYPE educationstatus AS ENUM ('student', 'graduate');
-- student - является студентом в данный момент
-- graduate - уже выпустился

CREATE TYPE worktype AS ENUM ('course', 'diploma', 'master', 'dissertation');

CREATE TYPE workstatus AS ENUM ('in progress', 'complete');


CREATE TABLE IF NOT EXISTS faculty (
	faculty_id serial PRIMARY KEY,
	"name" character varying(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS course (
    course_id smallserial PRIMARY KEY,
	faculty_id integer NOT NULL REFERENCES faculty(faculty_id),
    "name" character varying(200) NOT NULL,
	education_level educationlevel NOT NULL
);

CREATE TABLE department (
    department_id serial PRIMARY KEY,
	faculty_id integer NOT NULL REFERENCES faculty(faculty_id),
    "name" character varying(100) NOT NULL
); -- далее еще добавлено поле department_head_id, см. ALTER TABLE

CREATE TABLE professor (
    professor_id serial PRIMARY KEY,
	department_id integer REFERENCES department(department_id),
    surname character varying(50) NOT NULL,
    "name" character varying(50) NOT NULL,
    patronymic character varying(50) NOT NULL
);

ALTER TABLE department
ADD COLUMN department_head_id integer UNIQUE REFERENCES professor(professor_id);

CREATE TABLE IF NOT EXISTS student (
    student_card_id serial PRIMARY KEY,
	department_id integer REFERENCES department(department_id),
	course_id integer REFERENCES course(course_id),
    surname character varying(50) NOT NULL,
    "name" character varying(50) NOT NULL,
    patronymic character varying(50) NOT NULL,
	"year" integer NOT NULL,
	phone_number VARCHAR(15) NOT NULL,
	email VARCHAR(50) NOT NULL,
	birth_date date NOT NULL
);

CREATE TABLE qualification_work (
    work_id serial PRIMARY KEY,
	student_card_id integer NOT NULL REFERENCES student(student_card_id),
	supervisor_id integer NOT NULL REFERENCES professor(professor_id),
    "name" character varying(400) NOT NULL,
    work_type worktype NOT NULL,
	work_status workstatus NOT NULL,
	grade integer CHECK (work_status = 'complete' AND grade IS NOT NULL 
						 OR work_status = 'in progress' AND grade IS NULL)
);
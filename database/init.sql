CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    head_of_department VARCHAR(255)
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    second_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    department_id INT REFERENCES departments(id),
    education_level VARCHAR(50),
    thesis_title VARCHAR(255),
    diploma_score INT CHECK (diploma_score >= 0 AND diploma_score <= 5),
    graduation_year INT
);
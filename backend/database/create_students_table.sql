CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    student_ticket_number VARCHAR(50),
    education_level VARCHAR(50),
    department VARCHAR(100),
    thesis_title VARCHAR(255),
    is_archived BOOLEAN DEFAULT FALSE
);
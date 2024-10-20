SELECT faculty_id, faculty.name, course.name, course.education_level
FROM faculty INNER JOIN course
USING (faculty_id)
ORDER BY faculty_id, education_level


SELECT faculty.name AS "Факультет", department.name AS "Кафедра", 
	professor.surname AS "Фамилия", professor.name AS "Имя", professor.patronymic AS "Отчество"
FROM professor INNER JOIN department
USING (department_id) INNER JOIN faculty
USING (faculty_id)


SELECT f."name" AS Факультет, COUNT(p.professor_id) AS "Количество преподавателей"
FROM faculty f
JOIN department d ON f.faculty_id = d.faculty_id
LEFT JOIN professor p ON d.department_id = p.department_id
GROUP BY f.faculty_id, f."name"
ORDER BY "Количество преподавателей" DESC;*/


SELECT 
    d.department_id,
    d.name AS department_name,
    p.professor_id,
    CONCAT(p.surname, ' ', p.name, ' ', p.patronymic) AS department_head
FROM 
    department d
LEFT JOIN 
    professor p ON d.department_head_id = p.professor_id;


SELECT *
FROM department


/*Напиши запрос, который для каждого направления и 
курса (year у студента) выводит всех студентов и для 
каждого студента его кафедру*/
SELECT 
    c."name" AS course_name,
    s.year,
    s.surname,
    s.name,
    s.patronymic,
    d."name" AS department_name
FROM 
    student s
JOIN 
    course c ON s.course_id = c.course_id
LEFT JOIN 
    department d ON s.department_id = d.department_id
ORDER BY 
	s.surname, s.name, s.patronymic
    --c.course_id, s.year, s.surname;


SELECT *
FROM course
ORDER BY course_id


SELECT 
    c.course_id,
    c.name AS course_name,
    c.education_level,
    f.name AS faculty_name,
    s.year,
    COUNT(s.student_card_id) AS student_count
FROM 
    course c
JOIN 
    faculty f ON c.faculty_id = f.faculty_id
LEFT JOIN 
    student s ON c.course_id = s.course_id
GROUP BY 
    c.course_id, c.name, c.education_level, f.name, s.year
ORDER BY 
    student_count;


/*Напиши запрос, который для каждого направления 
и курса выводит количество студентов. Кроме того, 
пусть будет столбец с наименованием факультета. 
Для каждого факультета пусть выводится строка 
TOTAL с количеством всех студентов этого факультета*/
WITH StudentCounts AS (
    SELECT
        c.course_id,
        c.name AS course_name,
        f.name AS faculty_name,
        COUNT(s.student_card_id) AS student_count
    FROM
        course c
    JOIN
        faculty f ON c.faculty_id = f.faculty_id
    LEFT JOIN
        student s ON c.course_id = s.course_id
    GROUP BY
        c.course_id, c.name, f.name
),
TotalCounts AS (
    SELECT
        faculty_name,
        SUM(student_count) AS total_students
    FROM
        StudentCounts
    GROUP BY
        faculty_name
)
SELECT 
    course_id,
    course_name,
    faculty_name,
    student_count
FROM 
    StudentCounts

UNION ALL

SELECT 
    NULL AS course_id,
    'TOTAL' AS course_name,
    faculty_name,
    total_students AS student_count
FROM 
    TotalCounts

ORDER BY 
    faculty_name, course_id;

/*Напиши запрос, который показывает для 
каждого факультета количество учащихся на 
нем и количество преподавателей на нем. 
Кроме того, пусть в конце таблицы содержится 
информация о полном количестве студентов и 
преподавателей во всем университете*/
WITH FacultyCounts AS (
    SELECT
        f.faculty_id,
        f.name AS faculty_name,
        COUNT(DISTINCT s.student_card_id) AS student_count,
        COUNT(DISTINCT p.professor_id) AS professor_count
    FROM
        faculty f
    LEFT JOIN
        student s ON f.faculty_id = (SELECT faculty_id FROM course WHERE course_id = s.course_id)
    LEFT JOIN
        professor p ON f.faculty_id = p.department_id
    GROUP BY
        f.faculty_id, f.name
),
TotalCounts AS (
    SELECT
        SUM(student_count) AS total_students,
        SUM(professor_count) AS total_professors
    FROM
        FacultyCounts
)
SELECT 
    faculty_name,
    student_count,
    professor_count
FROM 
    FacultyCounts

UNION ALL

SELECT 
    'TOTAL' AS faculty_name,
    total_students,
    total_professors
FROM 
    TotalCounts

ORDER BY 
    faculty_name;
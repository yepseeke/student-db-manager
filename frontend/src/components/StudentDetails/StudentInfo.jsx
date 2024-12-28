import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './StudentInfo.css';

function StudentInfo({ student, onSave }) {
    const [editing, setEditing] = useState(false);
    const [editedStudent, setEditedStudent] = useState(student);
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await fetch('/faculties');
                if (!response.ok) {
                    throw new Error('Failed to fetch faculties');
                }
                const data = await response.json();
                setFaculties(data.faculties);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await fetch('/departments');
                if (!response.ok) {
                    throw new Error('Failed to fetch departments');
                }
                const data = await response.json();
                setDepartments(data.departments);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFaculties();
        fetchDepartments();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedStudent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveClick = () => {
        // Проверяем, что измененные поля отличаются от исходных данных
        const updatedFields = Object.keys(editedStudent).reduce((result, key) => {
            if (editedStudent[key] !== student[key]) {
                result[key] = editedStudent[key];
            }
            return result;
        }, {});

        if (Object.keys(updatedFields).length > 0) {
            onSave(updatedFields);
        }
        setEditing(false);
    };

    return (
        <div className="student-info">
            {editing ? (
                <div className="student-edit-form">
                    <label>
                        Фамилия:
                        <input
                            type="text"
                            name="last_name"
                            value={editedStudent.last_name || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Имя:
                        <input
                            type="text"
                            name="first_name"
                            value={editedStudent.first_name || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Отчество:
                        <input
                            type="text"
                            name="patronomyc"
                            value={editedStudent.patronomyc || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Факультет:
                        <select
                            name="faculty_id"
                            value={editedStudent.faculty_id || ''}
                            onChange={handleInputChange}
                        >
                            {faculties.map((faculty) => (
                                <option key={faculty.id} value={faculty.id}>
                                    {faculty.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Кафедра:
                        <select
                            name="department_id"
                            value={editedStudent.department_id || ''}
                            onChange={handleInputChange}
                        >
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Телефон:
                        <input
                            type="text"
                            name="phone"
                            value={editedStudent.phone || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={editedStudent.email || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <div className={'student-edit-form-buttons-container'}>
                        <button onClick={handleSaveClick}>Сохранить</button>
                        <button onClick={() => setEditing(false)}>Отмена</button>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="student-details-name">
                        {`${student.last_name} ${student.first_name} ${student.patronomyc}`}
                    </h2>
                    <div className="student-info-item">
                        <span className="student-info-label">Факультет:</span>
                        <span className="student-info-value">{student.faculty}</span>
                    </div>
                    <div className="student-info-item">
                        <span className="student-info-label">Кафедра:</span>
                        <span className="student-info-value">{student.department}</span>
                    </div>
                    <div className="student-info-item">
                        <span className="student-info-label">Email:</span>
                        <span className="student-info-value">{student.email}</span>
                    </div>
                    <div className="student-info-item">
                        <span className="student-info-label">Телефон:</span>
                        <span className="student-info-value">{student.phone}</span>
                    </div>
                    <button className={'edit-button'} onClick={() => setEditing(true)}>Редактировать</button>
                </div>
            )}
        </div>
    );
}

StudentInfo.propTypes = {
    student: PropTypes.shape({
        last_name: PropTypes.string.isRequired,
        first_name: PropTypes.string.isRequired,
        patronomyc: PropTypes.string.isRequired,
        faculty: PropTypes.string.isRequired,
        department: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
};

export default StudentInfo;

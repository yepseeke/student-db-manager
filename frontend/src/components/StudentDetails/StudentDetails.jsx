import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentInfo from './StudentInfo';
import WorkList from './WorkList';
import './StudentDetails.css';

function StudentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStudentDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/student_card?id=${id}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch student details');
            }
            const data = await response.json();
            setStudentData(data);
        } catch (error) {
            console.error('Error fetching student details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async () => {
        try {
            const response = await fetch(`/archive_student?id=${id}`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Failed to archive student');
            }
            alert('Студент успешно архивирован');
        } catch (error) {
            console.error('Ошибка при архивировании студента:', error);
            alert('Не удалось архивировать студента');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/delete_student?id=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete student');
            }
            alert('Студент успешно удален');
            navigate('/');
        } catch (error) {
            console.error('Ошибка при удалении студента:', error);
            alert('Не удалось удалить студента');
        }
    };

    const handleSave = async (updatedStudent) => {
        try {
            const params = new URLSearchParams();
            params.append('student_id', id);

            // Проверка измененных данных
            if (updatedStudent.department_id) {
                params.append('department_id', updatedStudent.department_id);
            }
            if (updatedStudent.faculty_id) {
                params.append('faculty_id', updatedStudent.faculty_id);
            }
            if (updatedStudent.first_name) {
                params.append('name', updatedStudent.first_name);
            }
            if (updatedStudent.last_name) {
                params.append('surname', updatedStudent.last_name);
            }
            if (updatedStudent.patronomyc) {
                params.append('patronymic', updatedStudent.patronomyc);
            }
            if (updatedStudent.phone) {
                params.append('phone_number', updatedStudent.phone);
            }
            if (updatedStudent.email) {
                params.append('email', updatedStudent.email);
            }

            if (Array.from(params.entries()).length <= 1) {
                alert('Алерт')
                return;
            }

            const response = await fetch(`/update_student?${params.toString()}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error('Failed to update student');
            }

            alert('Данные студента успешно обновлены');
            fetchStudentDetails();
        } catch (error) {
            console.error('Ошибка при обновлении данных студента:', error);
            alert('Не удалось обновить данные студента');
        }
    };



    const handleWorkAdded = () => {
        fetchStudentDetails();
    };

    useEffect(() => {
        fetchStudentDetails();
    }, [id]);

    if (loading) {
        return <p>Загрузка информации о студенте...</p>;
    }

    if (!studentData) {
        return <p>Информация о студенте недоступна.</p>;
    }

    return (
        <div className="student-details">
            <div className="student-details-content">
                <div className="info">
                    <StudentInfo
                        student={studentData.student}
                        onSave={handleSave}
                    />
                </div>
                <div className="avatar">
                    <img
                        src="/src/components/Pictures/cyberpunk_snowman.webp"
                        alt="Аватар студента"
                        className="student-avatar"
                    />
                </div>
                <div className="student-actions">
                    <button className="student-action-button archive-button" onClick={handleArchive}>
                        Архивировать
                    </button>
                    <button className="student-action-button delete-button" onClick={handleDelete}>
                        Удалить
                    </button>
                </div>
            </div>

            <div className="works">
                <WorkList
                    works={studentData.qualification_works}
                    studentId={id}
                    onWorkAdded={handleWorkAdded}
                />
            </div>
        </div>
    );
}

export default StudentDetails;

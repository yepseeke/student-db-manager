import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentInfo from './StudentInfo';
import WorkList from './WorkList';
import './StudentDetails.css';

function StudentDetails() {
    const { id } = useParams(); // Получение ID студента из URL
    const navigate = useNavigate(); // Для перенаправления после удаления студента
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

    useEffect(() => {
        fetchStudentDetails();
    }, [id]);

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
            navigate('/'); // Перенаправление на список студентов
        } catch (error) {
            console.error('Ошибка при удалении студента:', error);
            alert('Не удалось удалить студента');
        }
    };

    const handleWorkAdded = () => {
        // Обновление данных после добавления работы
        fetchStudentDetails();
    };

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
                    <StudentInfo student={studentData.student} />
                </div>
                <div className="avatar">
                    <img
                        src="/src/components/Pictures/cyberpunk_snowman.webp"
                        alt="Аватар студента"
                        className="student-avatar"
                    />
                </div>
                <div className="student-actions">
                    <button className="student-action-button edit-button">Редактировать</button>
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

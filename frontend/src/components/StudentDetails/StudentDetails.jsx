import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentInfo from './StudentInfo';
import WorkList from './WorkList';
import './StudentDetails.css';

function StudentDetails() {
    const { id } = useParams(); // Получение ID студента из URL
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/student_card?id=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch student details');
                }
                const data = await response.json();
                console.log(data);
                setStudentData(data);
            } catch (error) {
                console.error('Error fetching student details:', error);
            } finally {
                setLoading(false);
            }
        };

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
            <div className="header">
                <div className="info">
                    <StudentInfo student={studentData.student} />
                </div>
                <div className="avatar">
                    <img src={studentData.student.avatar} alt="Аватар студента" />
                </div>
            </div>
            <div className="works">
                <WorkList works={studentData.qualification_works} />
            </div>
        </div>
    );
}

export default StudentDetails;
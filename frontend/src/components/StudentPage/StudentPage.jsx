import  { useState } from 'react';
import './StudentPage.css';

const StudentInfo = ({ student, onEdit, isEditing, onChange }) => {
    return (
        <div className="student-info">
            <h2 className="student-name">{student.name}</h2>
            <div className="info-row">
                <span className="info-label">факультет:</span>
                {isEditing ? (
                    <input
                        type="text"
                        value={student.faculty}
                        onChange={(e) => onChange('faculty', e.target.value)}
                    />
                ) : (
                    <span>{student.faculty}</span>
                )}
            </div>
            <div className="info-row">
                <span className="info-label">группа:</span>
                {isEditing ? (
                    <input
                        type="text"
                        value={student.group}
                        onChange={(e) => onChange('group', e.target.value)}
                    />
                ) : (
                    <span>{student.group}</span>
                )}
            </div>
            <div className="info-row">
                <span className="info-label">кафедра:</span>
                {isEditing ? (
                    <input
                        type="text"
                        value={student.department}
                        onChange={(e) => onChange('department', e.target.value)}
                    />
                ) : (
                    <span>{student.department}</span>
                )}
            </div>
            <div className="info-row">
                <span className="info-label">дата рождения:</span>
                {isEditing ? (
                    <input
                        type="date"
                        value={student.dob}
                        onChange={(e) => onChange('dob', e.target.value)}
                    />
                ) : (
                    <span>{student.dob}</span>
                )}
            </div>
            <div className="info-row">
                <span className="info-label">почта:</span>
                {isEditing ? (
                    <input
                        type="email"
                        value={student.email}
                        onChange={(e) => onChange('email', e.target.value)}
                    />
                ) : (
                    <span>{student.email}</span>
                )}
            </div>
            <div className="info-row">
                <span className="info-label">номер телефона:</span>
                {isEditing ? (
                    <input
                        type="tel"
                        value={student.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                    />
                ) : (
                    <span>{student.phone}</span>
                )}
            </div>
            <div className="info-row">
                <span className="info-label">научный руководитель:</span>
                {isEditing ? (
                    <input
                        type="text"
                        value={student.advisor}
                        onChange={(e) => onChange('advisor', e.target.value)}
                    />
                ) : (
                    <span>{student.advisor}</span>
                )}
            </div>
        </div>
    );
};

const CourseWork = ({ work }) => {
    return (
        <tr>
            <td>{work.topic}</td>
            <td>{work.year}</td>
            <td>{work.advisor}</td>
        </tr>
    );
};

const StudentPage = () => {
    const [student, setStudent] = useState({
        name: 'Антонова Дарья Ярославовна',
        faculty: 'математический',
        group: 'ПМИ-11МО',
        department: 'математического моделирования',
        dob: '2000-09-18',
        email: 'yahehochnichegodelat@suka.com',
        phone: '8 (999) 999-99-99',
        advisor: 'Габриэль Солис',
        avatar: './avatar.jpg',
        courseWorks: [
            {
                topic: 'Оптимизация параметров подкрепленной шпангоутами цилиндрической оболочки',
                year: '2022',
                advisor: 'Шматко С. П.',
            },
        ],
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field, value) => {
        setStudent((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <div className="student-page">
            <header className="page-header">
                <img src="./logo.svg" alt="Logo" className="logo" />
                <h1 className="student-name">{student.name}</h1>
                <button className="edit-button" onClick={handleEditClick}>
                    {isEditing ? 'Сохранить' : 'Редактировать'}
                </button>
            </header>
            <main>
                <div className="student-details">
                    <img src={student.avatar} alt="Avatar" className="avatar" />
                    <StudentInfo
                        student={student}
                        isEditing={isEditing}
                        onChange={handleInputChange}
                    />
                </div>
                <section className="course-works">
                    <h2>Курсовые работы</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>тема</th>
                            <th>год</th>
                            <th>руководитель</th>
                        </tr>
                        </thead>
                        <tbody>
                        {student.courseWorks.map((work, index) => (
                            <CourseWork key={index} work={work} />
                        ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default StudentPage;

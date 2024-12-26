import './StudentInfo.css';

function StudentInfo({ student }) {
    return (
        <div className="student-info">
            <h2>{`${student.last_name} ${student.first_name} ${student.patronomyc}`}</h2>
            <p><strong>Факультет:</strong> {student.faculty}</p>
            <p><strong>Кафедра:</strong> {student.department}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Телефон:</strong> {student.phone}</p>
        </div>
    );
}

export default StudentInfo;

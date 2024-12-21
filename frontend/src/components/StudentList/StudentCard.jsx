import './StudentCard.css';
import PropTypes from 'prop-types';

function StudentCard({ student }) {
    return (
        <div className="student-card">
            <h2>{`${student.LastName} ${student.FirstName} ${student.Patronomyc}`}</h2>
            <p><span>Факультет: </span>{student.Faculty || 'Не указан'}</p>
            <p><span>Группа: </span>{student.Group || 'Не указана'}</p>
            <p><span>Кафедра: </span>{student.Department_ID || 'Не указана'}</p>
            <p><span>Ст. обр.: </span>магистратура</p>
        </div>
    );
}

StudentCard.propTypes = {
    student: PropTypes.shape({
        LastName: PropTypes.string.isRequired,
        FirstName: PropTypes.string.isRequired,
        Patronomyc: PropTypes.string.isRequired,
        Faculty: PropTypes.string,
        Group: PropTypes.string,
        Department_ID: PropTypes.string,
    }).isRequired,
};

export default StudentCard;
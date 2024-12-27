import './StudentCard.css';
import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";

function StudentCard({ student }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/student/${student.id}`);
    };

    return (
        <div className="student-card" onClick={handleClick}>
            <h2>{`${student.last_name} ${student.first_name} ${student.patronomyc}`}</h2>
            <p><span>Факультет: </span>{student.faculty_name}</p>
            <p><span>Группа: </span>{student.group_name}</p>
            <p><span>Ступень образования: </span>{student.education_level}</p>
            <p><span>Студенческий билет: </span>{student.id}</p>
        </div>
    );
}

StudentCard.propTypes = {
    student: PropTypes.shape({
        id: PropTypes.number.isRequired,
        last_name: PropTypes.string.isRequired,
        first_name: PropTypes.string.isRequired,
        patronomyc: PropTypes.string.isRequired,
        faculty_name: PropTypes.string.isRequired,
        group_name : PropTypes.string.isRequired,
        education_level: PropTypes.string.isRequired,
    }).isRequired,
};

export default StudentCard;

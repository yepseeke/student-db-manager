import './StudentInfo.css';
import PropTypes from "prop-types";

function StudentInfo({ student }) {
    return (
        <div className="student-info">
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
};

export default StudentInfo;

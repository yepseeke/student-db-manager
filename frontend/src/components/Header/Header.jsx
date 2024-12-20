import './Header.css';
import PropTypes from 'prop-types';

function Header({ onAddStudentClick }) {
    return (
        <header className="header">
            <div className="header-content">
                <div className="left-section">
                    <img src="/src/Logo.svg" alt="Logo" className="logo" />
                    <h1 className="title">lost mary blue razz</h1>
                </div>
                <button className="add-student-button" onClick={onAddStudentClick}>Добавить студента</button>
            </div>
        </header>
    );
}

Header.propTypes = {
    onAddStudentClick: PropTypes.func.isRequired,
};

export default Header;
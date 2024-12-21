import './AddStudentModal.css';
import PropTypes from 'prop-types';

function AddStudentModal({ onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Добавление нового студента</h2>
                <form>
                    <input className="modal-input" type="text" placeholder="ФИО" required />
                    <input className="modal-input" type="text" placeholder="Факультет" required />
                    <input className="modal-input" type="text" placeholder="Группа" required />
                    <input className="modal-input" type="text" placeholder="Кафедра" required />
                    <input className="modal-input" type="date" placeholder="Дата рождения" required />
                    <input className="modal-input" type="email" placeholder="Почта" required />
                    <input className="modal-input" type="tel" placeholder="Номер телефона" required />
                    <input className="modal-input" type="text" placeholder="Научный руководитель" required />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Закрыть</button>
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

AddStudentModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default AddStudentModal;
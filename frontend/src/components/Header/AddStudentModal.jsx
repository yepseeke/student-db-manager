import './AddStudentModal.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

function AddStudentModal({ onClose, onStudentAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        patronymic: '',
        phone_number: '',
        email: '',
        birth_date: '',
        group: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const params = new URLSearchParams(formData);
            const response = await fetch(`/add_student?${params.toString()}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to add student');
            }

            alert('Студент успешно добавлен');
            onClose();
            onStudentAdded();
        } catch (error) {
            console.error('Ошибка при добавлении студента:', error);
            alert('Не удалось добавить студента');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Добавление нового студента</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="modal-input"
                        type="text"
                        name="name"
                        placeholder="Имя"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        className="modal-input"
                        type="text"
                        name="surname"
                        placeholder="Фамилия"
                        value={formData.surname}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        className="modal-input"
                        type="text"
                        name="patronymic"
                        placeholder="Отчество"
                        value={formData.patronymic}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        className="modal-input"
                        type="text"
                        name="group"
                        placeholder="Группа"
                        value={formData.group}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        className="modal-input"
                        type="tel"
                        name="phone_number"
                        placeholder="Номер телефона"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                    />
                    <input
                        className="modal-input"
                        type="email"
                        name="email"
                        placeholder="Почта"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <input
                        className="modal-input"
                        type="date"
                        name="birth_date"
                        placeholder="Дата рождения"
                        value={formData.birth_date}
                        onChange={handleInputChange}
                        required
                    />
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
    onStudentAdded: PropTypes.func.isRequired,
};

export default AddStudentModal;

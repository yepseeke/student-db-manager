import './AddWorkModal.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

function AddWorkModal({ onClose, studentId, onWorkAdded }) {
    const [formData, setFormData] = useState({
        supervisor_id: '',
        name: '',
        work_type: 'course',
        work_status: 'in progress',
        grade: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const params = new URLSearchParams();
            params.append('student_id', studentId);
            params.append('supervisor_id', formData.supervisor_id);
            params.append('name', formData.name);
            params.append('work_type', formData.work_type);
            params.append('work_status', formData.work_status);
            if (formData.grade) {
                params.append('grade', formData.grade);
            }

            const response = await fetch(`/add_qualification_work?${params.toString()}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to add qualification work');
            }

            alert('Квалификационная работа успешно добавлена');
            onWorkAdded(); // Обновление списка работ
            onClose(); // Закрытие модального окна
        } catch (error) {
            console.error('Ошибка при добавлении работы:', error);
            alert('Не удалось добавить квалификационную работу');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Добавление квалификационной работы</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="modal-input"
                        type="text"
                        name="supervisor_id"
                        placeholder="ID профессора"
                        value={formData.supervisor_id}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="modal-input"
                        type="text"
                        name="name"
                        placeholder="Название работы"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <select
                        className="modal-input"
                        name="work_type"
                        value={formData.work_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="course">Курсовая</option>
                        <option value="diploma">Диплом</option>
                        <option value="master">Магистерская</option>
                        <option value="dissertation">Диссертация</option>
                    </select>
                    <select
                        className="modal-input"
                        name="work_status"
                        value={formData.work_status}
                        onChange={handleChange}
                        required
                    >
                        <option value="in progress">В процессе</option>
                        <option value="complete">Завершено</option>
                    </select>
                    <input
                        className="modal-input"
                        type="number"
                        name="grade"
                        placeholder="Оценка"
                        value={formData.grade}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        required={formData.work_status === 'complete'}
                    />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>
                            Закрыть
                        </button>
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

AddWorkModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    studentId: PropTypes.string.isRequired,
    onWorkAdded: PropTypes.func.isRequired,
};

export default AddWorkModal;

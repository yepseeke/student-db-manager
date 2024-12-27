import './WorkList.css';
import AddWorkModal from './AddWorkModal';
import { useState } from 'react';
import PropTypes from "prop-types";

function WorkList({ works, studentId, onWorkAdded }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="work-list">
            <h3 className="work-list-header">Квалификационные работы:</h3>
            <div className="work-table">
                <div className="work-table-header">
                    <div className="work-table-column">Название</div>
                    <div className="work-table-column">Руководитель</div>
                    <div className="work-table-column">Статус</div>
                    <div className="work-table-column">Тип</div>
                    <div className="work-table-column">Оценка</div>
                </div>
                {works && works.length > 0 ? (
                    works.map((work) => (
                        <div key={work.id} className="work-table-row">
                            <div className="work-table-cell">{work.name}</div>
                            <div className="work-table-cell">{work.supervisor}</div>
                            <div className="work-table-cell">{work.work_status}</div>
                            <div className="work-table-cell">{work.work_type}</div>
                            <div className="work-table-cell">{work.grade || 'Нет оценки'}</div>
                        </div>
                    ))
                ) : (
                    <div className="work-table-empty">Нет данных о работах.</div>
                )}
            </div>

            <div className="add-work-button-container">
                <button className="add-work-button" onClick={handleOpenModal}>
                    Добавить работу
                </button>
            </div>

            {isModalOpen && (
                <AddWorkModal
                    studentId={studentId}
                    onClose={handleCloseModal}
                    onWorkAdded={onWorkAdded}
                />
            )}
        </div>
    );
}

WorkList.propTypes = {
    works: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            supervisor: PropTypes.string.isRequired,
            work_status: PropTypes.string.isRequired,
            work_type: PropTypes.string.isRequired,
            grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ).isRequired,
    studentId: PropTypes.number.isRequired,
    onWorkAdded: PropTypes.func.isRequired,
};

export default WorkList;

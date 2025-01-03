import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Filters from './components/Filters/Filters';
import StudentList from './components/StudentList/StudentList';
import StudentDetails from './components/StudentDetails/StudentDetails';
import AddStudentModal from './components/Header/AddStudentModal';
import './App.css';

function App() {
    const [filters, setFilters] = useState({
        selectedFaculties: [],
        selectedDepartments: [],
    });

    const [isModalOpen, setModalOpen] = useState(false);
    const [studentsUpdated, setStudentsUpdated] = useState(false); // Флаг для обновления списка

    const applyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleStudentsUpdate = () => {
        setStudentsUpdated((prev) => !prev); // Переключение флага для обновления списка
    };

    return (
        <Router>
            <div className="app-container">
                <Header onAddStudentClick={openModal} />
                <div className="main-content">
                    <Routes>
                        {/* Главная страница со списком студентов */}
                        <Route
                            path="/"
                            element={
                                <>
                                    <Filters onApplyFilters={applyFilters} />
                                    <StudentList filters={filters} studentsUpdated={studentsUpdated} />
                                </>
                            }
                        />
                        {/* Страница с информацией о студенте */}
                        <Route path="/student/:id" element={<StudentDetails />} />
                    </Routes>
                </div>
                {isModalOpen && (
                    <AddStudentModal
                        onClose={closeModal}
                        onStudentAdded={handleStudentsUpdate}
                    />
                )}
            </div>
        </Router>
    );
}

export default App;

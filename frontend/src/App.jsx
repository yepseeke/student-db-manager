import { useState } from 'react';
import Header from './components/Header/Header';
import Filters from './components/Filters/Filters';
import StudentList from './components/StudentList/StudentList';
import AddStudentModal from './components/Header/AddStudentModal';
import './App.css';

function App() {
    const [filters, setFilters] = useState({
        selectedFaculties: [],
        selectedGroups: [],
        selectedDepartments: [],
        selectedEducationLevels: [],
    });

    const [isModalOpen, setModalOpen] = useState(false);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const resetFilters = () => {
        setFilters({
            selectedFaculties: [],
            selectedGroups: [],
            selectedDepartments: [],
            selectedEducationLevels: [],
        });
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <div className="app-container">
            <Header onAddStudentClick={openModal} />
            <div className="main-content">
                <Filters onFilterChange={handleFilterChange} onResetFilters={resetFilters} filters={filters} />
                <StudentList filters={filters} />
            </div>
            {isModalOpen && <AddStudentModal onClose={closeModal} />}
        </div>
    );
}

export default App;
import { useEffect, useRef, useState } from 'react';
import FilterGroup from './FilterGroup';
import './Filters.css';
import PropTypes from 'prop-types';

function Filters({ onApplyFilters }) {
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [selectedFacultyIds, setSelectedFacultyIds] = useState([]);
    const [selectedDepartmentIds, setSelectedDepartmentIds] = useState([]);

    const fetchFaculties = async () => {
        try {
            const response = await fetch('/faculties');
            if (!response.ok) {
                throw new Error('Failed to fetch faculties');
            }
            const data = await response.json();
            setFaculties(data.faculties);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch('/departments');
            if (!response.ok) {
                throw new Error('Failed to fetch departments');
            }
            const data = await response.json();
            setDepartments(data.departments);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFaculties();
        fetchDepartments();
    }, []);

    // Фильтрация кафедр при изменении выбранных факультетов
    useEffect(() => {
        if (selectedFacultyIds.length === 0) {
            // Если факультеты не выбраны, показываем все кафедры
            setFilteredDepartments(departments);
        } else {
            // Фильтруем кафедры, принадлежащие выбранным факультетам
            const filtered = departments.filter((department) =>
                selectedFacultyIds.includes(department.faculty_id)
            );
            setFilteredDepartments(filtered);
            // Удаляем из выбранных кафедр те, которые больше не видны
            setSelectedDepartmentIds((prevSelected) =>
                prevSelected.filter((id) =>
                    filtered.some((department) => department.id === id)
                )
            );
        }
    }, [selectedFacultyIds, departments]);

    const handleApplyFilters = () => {
        onApplyFilters({
            selectedFaculties: selectedFacultyIds,
            selectedDepartments: selectedDepartmentIds,
        });
    };

    const handleResetFilters = () => {
        setSelectedFacultyIds([]);
        setSelectedDepartmentIds([]);
        onApplyFilters({
            selectedFaculties: [],
            selectedDepartments: [],
        });
        resetSearchFields();
    };

    const resetSearchFields = () => {
        facultiesRef.current.forEach((reset) => reset());
        departmentsRef.current.forEach((reset) => reset());
    };

    // refs для сброса полей поиска
    const facultiesRef = useRef([]);
    const departmentsRef = useRef([]);

    return (
        <div className="filters-container">
            <h3>Фильтры:</h3>
            <FilterGroup
                label="Факультет"
                options={faculties.map((f) => ({ label: f.name, value: f.id }))}
                selectedValues={selectedFacultyIds}
                onChange={setSelectedFacultyIds}
                withSearch={true}
                registerReset={(reset) => facultiesRef.current.push(reset)}
            />
            <FilterGroup
                label="Кафедра"
                options={filteredDepartments.map((d) => ({
                    label: d.name,
                    value: d.id,
                }))}
                selectedValues={selectedDepartmentIds}
                onChange={setSelectedDepartmentIds}
                withSearch={true}
                registerReset={(reset) => departmentsRef.current.push(reset)}
            />
            <div className="buttons-container">
                <button className="reset-button" onClick={handleResetFilters}>
                    Сбросить фильтры
                </button>
                <button className="apply-button" onClick={handleApplyFilters}>
                    Применить
                </button>
            </div>
        </div>
    );
}

Filters.propTypes = {
    onApplyFilters: PropTypes.func.isRequired,
};

export default Filters;

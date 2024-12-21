import { useEffect } from 'react';
import FilterGroup from './FilterGroup';
import './Filters.css';
import PropTypes from "prop-types";

function Filters({ onFilterChange, onResetFilters, filters }) {
    const faculties = ['математический', 'физический', 'экономический', 'юридический'];
    const groups = ['ПМИ-11МО', 'ПМИ-11БО', 'ФИЗ-21МО', 'ФИЗ-21БО', 'ЭК-10МО', 'ЭК-10БО', 'ЮР-11МО', 'ЮР-11БО'];
    const departments = ['Математика', 'Физика', 'Экономика', 'Правоведение'];
    const educationLevels = ['бакалавриат', 'специалитет', 'магистратура'];

    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    return (
        <div className="filters-container">
            <h3>Фильтры:</h3>
            <FilterGroup
                label="Факультет"
                options={faculties}
                selectedValues={filters.selectedFaculties}
                onChange={(selected) => onFilterChange({ ...filters, selectedFaculties: selected })}
                withSearch={true}
            />
            <FilterGroup
                label="Группа"
                options={groups}
                selectedValues={filters.selectedGroups}
                onChange={(selected) => onFilterChange({ ...filters, selectedGroups: selected })}
                withSearch={true}
            />
            <FilterGroup
                label="Кафедра"
                options={departments}
                selectedValues={filters.selectedDepartments}
                onChange={(selected) => onFilterChange({ ...filters, selectedDepartments: selected })}
                withSearch={true}
            />
            <FilterGroup
                label="Ступень образования"
                options={educationLevels}
                selectedValues={filters.selectedEducationLevels}
                onChange={(selected) => onFilterChange({ ...filters, selectedEducationLevels: selected })}
                withSearch={false}
            />
            <button className="reset-button" onClick={onResetFilters}>Сбросить фильтры</button>
        </div>
    );
}

Filters.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    onResetFilters: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
};

export default Filters;
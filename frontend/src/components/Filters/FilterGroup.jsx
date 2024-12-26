import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './FilterGroup.css';

function FilterGroup({ label, options, selectedValues, onChange, withSearch, registerReset }) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Регистрируем функцию сброса
        if (registerReset) {
            registerReset(() => setSearchTerm(''));
        }
    }, [registerReset]);

    const handleOptionClick = (value) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((item) => item !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="filter-group">
            <label>{label}</label>
            {withSearch && (
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            )}
            <div className="options-list">
                {filteredOptions.map((option) => (
                    <div
                        key={option.value}
                        className={`option-item ${selectedValues.includes(option.value) ? 'selected' : ''}`}
                        onClick={() => handleOptionClick(option.value)}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
}

FilterGroup.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ).isRequired,
    selectedValues: PropTypes.arrayOf(PropTypes.number).isRequired,
    onChange: PropTypes.func.isRequired,
    withSearch: PropTypes.bool,
    registerReset: PropTypes.func, // Новое свойство
};

FilterGroup.defaultProps = {
    withSearch: false,
    registerReset: null,
};

export default FilterGroup;

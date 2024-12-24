import PropTypes from 'prop-types';
import { useState } from 'react';
import './Filters.css';

function FilterGroup({ label, options, selectedValues, onChange, withSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleOptionClick = (option) => {
        if (selectedValues.includes(option)) {
            onChange(selectedValues.filter((item) => item !== option));
        } else {
            onChange([...selectedValues, option]);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
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
                {filteredOptions.map((option, index) => (
                    <div
                        key={index}
                        className={`option-item ${selectedValues.includes(option) ? 'selected' : ''}`}
                        onClick={() => handleOptionClick(option)}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );
}

FilterGroup.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    withSearch: PropTypes.bool,
};

FilterGroup.defaultProps = {
    withSearch: false,
};

export default FilterGroup;
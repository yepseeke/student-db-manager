import { useState, useEffect, useRef } from 'react';
import './CustomPageSizeSelect.css';
import PropTypes from "prop-types";

function CustomPageSizeSelect({ pageSize, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const pageSizes = [10, 20, 40, 60];
    const dropdownRef = useRef(null);

    const handleOptionClick = (size) => {
        onChange(size);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    // Закрыть dropdown при клике вне компонента
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="page-size-selector" ref={dropdownRef}>
            <label>Количество на странице:</label>
            <div
                className={`custom-select ${isOpen ? 'open' : ''}`}
                onClick={toggleDropdown}
            >
                <span>{pageSize}</span>
                <span className="arrow-icon">▼</span>
            </div>
            <div className={`options-container ${isOpen ? 'open' : ''}`}>
                {pageSizes.map((size) => (
                    <div
                        key={size}
                        className="option"
                        onClick={() => handleOptionClick(size)}
                    >
                        {size}
                    </div>
                ))}
            </div>
        </div>
    );
}

CustomPageSizeSelect.propTypes = {
    pageSize: PropTypes.number,
    onChange: PropTypes.func.isRequired,
}

export default CustomPageSizeSelect;

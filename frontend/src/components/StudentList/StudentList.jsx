import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import StudentCard from './StudentCard';
import Pagination from '../Pagination/Pagination.jsx';
import CustomPageSizeSelect from '../CustomPageSizeSelect/CustomPageSizeSelect.jsx';
import './StudentList.css';

function StudentList({filters, studentsUpdated}) {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('ASC');
    const [pageSize, setPageSize] = useState(10); // Количество студентов на странице

    const fetchStudents = async (page, filters, order, pageSize) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('order', order);
            params.append('pageSize', pageSize);
            if (filters.selectedFaculties?.length) {
                params.append('facultyIds', filters.selectedFaculties.join(','));
            }
            if (filters.selectedDepartments?.length) {
                params.append('departmentIds', filters.selectedDepartments.join(','));
            }

            const response = await fetch(`/students_page?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            setStudents(data.students || []);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error('Ошибка загрузки студентов:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchStudents = async () => {
        await fetchStudents(currentPage, filters, sortOrder, pageSize);
        scrollToTop();
    };

    useEffect(() => {
        handleFetchStudents();
    }, [currentPage, studentsUpdated]);

    useEffect(() => {
        const fetchWithReset = async () => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                await handleFetchStudents();
            }
        };
        fetchWithReset();
    }, [filters, sortOrder, pageSize]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'ASC' ? 'DESC' : 'ASC'));
    };

    const handlePageSizeChange = (page_size) => {
        setPageSize(page_size);
    };

    return (
        <div className="student-list">
            <div className="sort-button-container">
                <button className="sort-button" onClick={toggleSortOrder}>
                    <img
                        src="/src/components/Pictures/Sort.svg"
                        alt="Сортировка"
                        style={{
                            transform: sortOrder === 'DESC' ? 'rotate(180deg)' : 'none',
                        }}
                    />
                    По алфавиту
                </button>
                <CustomPageSizeSelect pageSize={pageSize} onChange={handlePageSizeChange}/>
            </div>
            {loading ? (
                <p>Загрузка информации о студентах...</p>
            ) : students.length > 0 ? (
                students.map((student) => (
                    <StudentCard key={student.id} student={student}/>
                ))
            ) : (
                <p>Информация о студентах с выбранными параметрами отсутствует.</p>
            )}
            {students.length > 0 && !loading && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}

StudentList.propTypes = {
    filters: PropTypes.shape({
        selectedFaculties: PropTypes.arrayOf(PropTypes.number),
        selectedDepartments: PropTypes.arrayOf(PropTypes.number),
    }).isRequired,
    studentsUpdated: PropTypes.object.isRequired,
};

export default StudentList;

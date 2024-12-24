import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import StudentCard from './StudentCard';
import './StudentList.css';

const mockStudents = [
    {
        id: 1,
        FirstName: 'Дарья',
        LastName: 'Антонова',
        Patronomyc: 'Ярославовна',
        Faculty: 'математический',
        Group: 'ПМИ-11МО',
        Department_ID: 'Математика',
    },
    {
        id: 2,
        FirstName: 'Иван',
        LastName: 'Иванов',
        Patronomyc: 'Иванович',
        Faculty: 'физический',
        Group: 'ФИЗ-21МО',
        Department_ID: 'Физика',
    },
    {
        id: 3,
        FirstName: 'Анна',
        LastName: 'Петрова',
        Patronomyc: 'Сергеевна',
        Faculty: 'экономический',
        Group: 'ЭК-10МО',
        Department_ID: 'Экономика',
    },
    {
        id: 4,
        FirstName: 'Сергей',
        LastName: 'Сидоров',
        Patronomyc: 'Алексеевич',
        Faculty: 'юридический',
        Group: 'ЮР-11МО',
        Department_ID: 'Правоведение',
    },
    {
        id: 5,
        FirstName: 'Александр',
        LastName: 'Григорьев',
        Patronomyc: 'Викторович',
        Faculty: 'математический',
        Group: 'ЮР-11МО',
        Department_ID: 'Правоведение',
    },
];

function StudentList({ filters }) {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setStudents(mockStudents);
        }, 1000);
    }, []);

    const filteredStudents = students.filter((student) => {
        const { selectedFaculties, selectedGroups, selectedDepartments } = filters;

        return (
            (selectedFaculties.length === 0 || selectedFaculties.includes(student.Faculty)) &&
            (selectedGroups.length === 0 || selectedGroups.includes(student.Group)) &&
            (selectedDepartments.length === 0 || selectedDepartments.includes(student.Department_ID))
        );
    });

    return (
        <div className="student-list">
            {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
            ))}
        </div>
    );
}

StudentList.propTypes = {
    filters: PropTypes.shape({
        selectedFaculties: PropTypes.arrayOf(PropTypes.string).isRequired,
        selectedGroups: PropTypes.arrayOf(PropTypes.string).isRequired,
        selectedDepartments: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

export default StudentList;
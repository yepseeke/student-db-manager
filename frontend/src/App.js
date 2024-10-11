import React, { useEffect, useState } from 'react';

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/students')
      .then(response => {
        console.log("Response from server:", response);
        return response.json();
      })
      .then(data => {
        console.log("Parsed data:", data);
        setStudents(data);
      })
      .catch(error => {
        console.error("Error fetching students:", error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Student Registry</h1>
      <ul>
        {students.map(student => (
          <li key={student.ID}>
            {student.FullName} - {student.TicketNumber}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

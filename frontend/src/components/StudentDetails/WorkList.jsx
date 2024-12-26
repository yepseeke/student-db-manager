import './WorkList.css';

function WorkList({ works }) {
    return (
        <div className="work-list">
            <h3>Работы:</h3>
            {works.length > 0 ? (
                <ul>
                    {works.map((work) => (
                        <li key={work.id}>
                            <p><strong>Название:</strong> {work.name}</p>
                            <p><strong>Руководитель:</strong> {work.supervisor}</p>
                            <p><strong>Статус:</strong> {work.work_status}</p>
                            <p><strong>Тип:</strong> {work.work_type}</p>
                            <p><strong>Оценка:</strong> {work.grade}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет данных о работах.</p>
            )}
        </div>
    );
}

export default WorkList;

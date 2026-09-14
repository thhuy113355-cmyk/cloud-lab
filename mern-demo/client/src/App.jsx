import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({ code: '', name: '', email: '' });
    const [error, setError] = useState('');

    const fetchStudents = async () => {
        const res = await fetch('/api/students');
        if (!res.ok) throw new Error('Không thể tải danh sách sinh viên');
        const data = await res.json();
        setStudents(data);
    };

    useEffect(() => {
        fetchStudents().catch((err) => setError(err.message));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error || 'Không thể thêm sinh viên');
            return;
        }
        setFormData({ code: '', name: '', email: '' });
        fetchStudents().catch((err) => setError(err.message));
    };

    const handleDelete = async (code) => {
        if (!window.confirm('Bạn có chắc muốn xóa sinh viên này?')) return;

        setError('');
        const res = await fetch(`/api/students/code/${encodeURIComponent(code)}`, { method: 'DELETE' });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error || 'Không thể xóa sinh viên');
            return;
        }
        fetchStudents().catch((err) => setError(err.message));
    };

    return (
        <main className="student-page">
            <section className="student-header">
                <p className="eyebrow">Student directory</p>
                <h1>Quản lý sinh viên</h1>
                <p className="subtitle">Thêm và theo dõi thông tin sinh viên trong một danh sách gọn gàng.</p>
            </section>

            <section className="student-panel">
                <form className="student-form" onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label htmlFor="code">Mã sinh viên</label>
                        <input id="code" placeholder="Ví dụ: 234951" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
                    </div>
                    <div className="field-group">
                        <label htmlFor="name">Họ và tên</label>
                        <input id="name" placeholder="Nhập họ tên" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="sinhvien@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <button type="submit">Thêm sinh viên</button>
                </form>
                {error && <p className="form-error">{error}</p>}
            </section>

            <section className="student-list">
                <div className="list-heading">
                    <h2>Danh sách sinh viên</h2>
                    <span>{students.length} sinh viên</span>
                </div>
                <ul>
                    {students.map(s => (
                        <li key={s._id}>
                            <strong>{s.code || s.studentId}</strong>
                            <span>{s.name}</span>
                            <span>{s.email}</span>
                            <button className="delete-button" type="button" onClick={() => handleDelete(s.code || s.studentId)}>
                                Xóa
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
export default App;

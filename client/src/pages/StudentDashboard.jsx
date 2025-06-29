import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import LogoutButton from '../components/LogoutButton';

function StudentDashboard() {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 6;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get('/notice/user');
      setNotices(res.data);
    } catch {
      alert('Failed to load notices');
    }
  };

  const studentNotices = notices.filter(n => n.audience === 'student' || n.audience === 'all');

  const filteredNotices = studentNotices.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!filterDate || new Date(n.createdAt).toDateString() === new Date(filterDate).toDateString())
  );

  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstNotice, indexOfLastNotice);
  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

  const renderBadge = (audience) => (
    <span style={{
      backgroundColor: audience === 'student' ? '#28a745' : '#007bff',
      color: '#fff',
      fontWeight: 'bold',
      padding: '2px 10px',
      borderRadius: '4px',
      fontSize: '0.8rem'
    }}>
      {audience.charAt(0).toUpperCase() + audience.slice(1)}
    </span>
  );

  return (
    <div className="container py-4" style={{ minHeight: '100vh', background: 'linear-gradient(to right, #fdfbfb, #ebedee)' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success">🎓 Student Dashboard</h2>
        <LogoutButton />
      </div>

      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Search by title"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="col-md-6">
          <input type="date" className="form-control"
            value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
      </div>

      {currentNotices.map((n, i) => (
        <div key={i} className="card shadow-sm mb-3 border border-light">
          <div className={`card-header text-white d-flex justify-content-between align-items-center ${n.audience === 'student' ? 'bg-success' : 'bg-primary'}`}>
            <h5 className="mb-0 text-truncate">{n.title}</h5>
            {renderBadge(n.audience)}
          </div>
          <div className="card-body">
            <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>{n.message}</p>
            <div className="text-end">
              <small className="text-muted fst-italic">{new Date(n.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="text-center my-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm mx-1 ${currentPage === i + 1 ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;

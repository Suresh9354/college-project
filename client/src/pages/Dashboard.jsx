import axios from '../utils/axiosInstance';
import { useEffect, useState } from 'react';
import { getUser, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [notice, setNotice] = useState('');
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/login');

    axios.get('/notice')
      .then((res) => setNotice(res.data.msg))
      .catch((err) => alert(err.response.data.msg));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome {user?.role}</h2>
      <p>{notice}</p>

      {user?.role === 'admin' && (
        <button onClick={() => axios.post('/notice/create').then(res => alert(res.data.msg))}>
          Create Notice (Admin only)
        </button>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;

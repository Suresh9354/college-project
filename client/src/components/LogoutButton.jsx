import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <button className="btn btn-sm btn-danger" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;

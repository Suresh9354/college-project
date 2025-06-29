import { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/auth/login', formData);
      const { token, user } = res.data;

      // Save token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert('Login successful!');

      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/staff');
      else navigate('/student');

    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center px-3"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      }}
    >
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <form
          onSubmit={handleSubmit}
          className="bg-white border p-4 p-md-5 rounded-4 shadow-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(5px)',
          }}
        >
          <h2 className="mb-4 text-center" style={{ color: '#6f42c1' }}>
            Login
          </h2>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn text-white fw-bold w-100"
            style={{ backgroundColor: '#c084fc' }}
          >
            Login
          </button>

          <p className="mt-3 text-center">
            Don’t have an account?{' '}
            <a href="/register" className="text-decoration-none" style={{ color: '#6f42c1' }}>
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

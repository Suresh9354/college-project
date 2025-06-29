import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import LogoutButton from '../components/LogoutButton';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'student' });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student' });
  const [notice, setNotice] = useState({ title: '', message: '', audience: 'all' });
  const [editNotice, setEditNotice] = useState(null);
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const noticesPerPage = 6;

  useEffect(() => {
    fetchUsers();
    fetchNotices();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users');
      setUsers(res.data);
    } catch {
      alert('Failed to fetch users');
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await axios.get('/notice');
      const allData = res.data;
      const filtered = allData.filter(n => ['all', 'staff', 'student'].includes(n.audience.toLowerCase()));
      setNotices(filtered);
      setFilteredNotices(filtered);
    } catch {
      alert('Failed to fetch notices');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = notices.filter(
      n => (activeTab === 'all' || n.audience.toLowerCase() === activeTab) &&
        n.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredNotices(filtered);
    setCurrentPage(1);
    setCurrentPage1(1);
  };

  const handleTabChange = (audience) => {
    setActiveTab(audience);
    const filtered = notices.filter(n => audience === 'all' || n.audience.toLowerCase() === audience);
    setFilteredNotices(filtered);
    setCurrentPage(1);
    setCurrentPage1(1);
    setSearchTerm('');
  };

    const handleUpdateUser = async () => {
    try {
      const res = await axios.put(`/users/${editUser._id}`, editForm);
      setUsers(users.map(user => user._id === editUser._id ? res.data : user));
      setEditUser(null);
      alert('User updated successfully');
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const handleEditUser = (user) => {
    console.log("Edit User Clicked:", user);
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      alert('User deleted');
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await axios.post('/users', newUser);
      setUsers([...users, res.data]);
      setNewUser({ name: '', email: '', role: 'student' });
      alert('User added');
    } catch (err) {
      alert('Failed to add user');
    }
  };

    const handleAddNotice = async () => {
    try {
      await axios.post('/notice', notice);
      setNotice({ title: '', message: '', audience: 'all' });
      alert('Notice added');
      fetchNotices();
    } catch (err) {
      alert('Failed to add notice');
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await axios.delete(`/notice/${id}`);
      setNotices(notices.filter(n => n._id !== id));
      alert('Notice deleted');
    } catch (err) {
      alert('Failed to delete notice');
    }
  };

  const handleEditNotice = (notice) => {
    console.log("Edit Notice Clicked:", notice);
    setEditNotice(notice);
    setNotice({ title: notice.title, message: notice.message, audience: notice.audience });
  };

  const handleUpdateNotice = async () => {
    try {
      await axios.put(`/notice/${editNotice._id}`, notice);
      setEditNotice(null);
      setNotice({ title: '', message: '', audience: 'all' });
      fetchNotices();
      alert('Notice updated');
    } catch (err) {
      alert('Failed to update notice');
    }
  };


  const indexOfLast = currentPage * noticesPerPage;
  const indexOfFirst = indexOfLast - noticesPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

  const indexOfLast1 = currentPage1 * noticesPerPage;
  const indexOfFirst1 = indexOfLast1 - noticesPerPage;
  const currentNotices1 = filteredNotices.slice(indexOfFirst1, indexOfLast1);
  const totalPages1 = Math.ceil(filteredNotices.length / noticesPerPage);

  const chartData = {
    labels: ['All', 'Staff', 'Student'],
    datasets: [
      {
        label: 'Notices by Audience',
        data: [
          notices.filter(n => n.audience.toLowerCase() === 'all').length,
          notices.filter(n => n.audience.toLowerCase() === 'staff').length,
          notices.filter(n => n.audience.toLowerCase() === 'student').length,
        ],
        backgroundColor: ['#007bff', '#17a2b8', '#28a745'],
      },
    ],
  };

  const roleCounts = {
    admin: users.filter(u => u.role === 'admin').length,
    staff: users.filter(u => u.role === 'staff').length,
    student: users.filter(u => u.role === 'student').length,
  };

  const userChartData = {
    labels: ['Admin', 'Staff', 'Student'],
    datasets: [
      {
        label: 'Users by Role',
        data: [roleCounts.admin, roleCounts.staff, roleCounts.student],
        backgroundColor: ['#6f42c1', '#17a2b8', '#28a745'],
      },
    ],
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <LogoutButton />
      </div>

     

        <div className="row mb-4">
         <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header"> <h5 className="text-center mb-3">📢 {editNotice ? 'Edit Notice' : 'Add New Notice'}</h5></div>
            <div className="card-body">
             <input type="text" className="form-control mb-2" placeholder="Title" value={notice.title}
                onChange={e => setNotice({ ...notice, title: e.target.value })} />
              <textarea className="form-control mb-2" placeholder="Message" rows="3" style={{ resize: 'none' }} value={notice.message}
                onChange={e => setNotice({ ...notice, message: e.target.value })}></textarea>
              <select className="form-select mb-2" value={notice.audience}
                onChange={e => setNotice({ ...notice, audience: e.target.value })}>
                <option value="all">All</option>
                <option value="staff">Staff</option>
                <option value="student">Student</option>
              </select>
              <button className={`btn w-100 ${editNotice ? 'btn-warning' : 'btn-primary'}`} onClick={editNotice ? handleUpdateNotice : handleAddNotice}>
                {editNotice ? 'Update Notice' : 'Send Notice'}
              </button>
            </div>
          </div>
         </div>

         <div className="col-md-6">
          <div className="card mb-4" style={{ minHeight: '312px' }}>
            <div className="card-header"><h5 className="text-center mb-3">➕ Add New User</h5> </div>
            <div className="card-body">
              <input type="text" className="form-control mb-2" placeholder="Name" value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
              <input type="email" className="form-control mb-2" placeholder="Email" value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              <select className="form-select mb-2" value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="student">Student</option>
              </select>
              <button className="btn btn-success w-100 mt-5" onClick={handleAddUser}>Add User</button>
            </div>
          </div>
          </div>
        </div>
          

         
        <div className="row mb-4">
         <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">📢 Notice Distribution</div>
            <div className="card-body">
              <Pie data={chartData} />
            </div>
          </div>
         </div>
         <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">👤 User Role Distribution</div>
            <div className="card-body">
              <Pie data={userChartData} />
            </div>
          </div>
          </div>
        </div>

      {/* Notice Section */}
      <div className="card mb-5">
        <div className="card-header">📋 Manage Notices</div>
        <div className="card-body">
          <input className="form-control mb-3" placeholder="Search notice by title..." value={searchTerm} onChange={handleSearch} />

          <div className="btn-group mb-3">
            {['all', 'staff', 'student'].map(aud => (
              <button key={aud} className={`btn btn-${activeTab === aud ? '' : 'outline-'}primary`} onClick={() => handleTabChange(aud)}>{aud.toUpperCase()}</button>
            ))}
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {currentNotices.map((notice) => (
              <div className="col" key={notice._id}>
                <div className="card h-100">
                  <div className={`card-header bg-${notice.audience === 'staff' ? 'info' : notice.audience === 'student' ? 'success' : 'primary'} text-white`}>{notice.title}</div>
                  <div className="card-body">
                    <p className="card-text">{notice.message}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-between align-items-center">
                    <small>{new Date(notice.createdAt).toLocaleDateString()}</small>
                    <div>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditNotice(notice)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteNotice(notice._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {[...Array(totalPages)].map((_, i) => (
                  <li className={`page-item ${currentPage === i + 1 ? 'active' : ''}`} key={i}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* User Management Section */}
      <div className="card">
        <div className="card-header">👥 Manage Users</div>
        <div className="card-body">
          <table className="table table-hover table-bordered text-center">
             {editUser && (
              <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit User</h5>
                      <button type="button" className="btn-close" onClick={() => setEditUser(null)}></button>
                    </div>
                    <div className="modal-body">
                      <input type="text" className="form-control mb-2" value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                      <input type="email" className="form-control mb-2" value={editForm.email}
                        onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                      <select className="form-select" value={editForm.role}
                        onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                        <option value="student">Student</option>
                      </select>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setEditUser(null)}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleUpdateUser}>Save Changes</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <thead className="table-primary">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditUser(user)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

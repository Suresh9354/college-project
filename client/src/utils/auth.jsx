export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload;
};

export const logout = () => {
  localStorage.removeItem('token');
};

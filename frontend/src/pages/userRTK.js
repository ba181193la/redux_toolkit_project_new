// src/components/UserList.jsx
import React from 'react';
import { useFetchUsersQuery, useDeleteUserMutation } from '../redux/api/userApi';

const UserList = () => {
  const { data: users = [], isLoading, error } = useFetchUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching users</p>;

  return (
    <div>
      <h2>User List</h2>
      {users.map((user) => (
        <div key={user._id}>
          <p>{user.userName} - Age: {user.age}</p>
          <button onClick={() => deleteUser(user._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
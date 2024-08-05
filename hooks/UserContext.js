import React, { createContext, useState, useContext, useMemo } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    username: 'john_doe',
    name: 'John Doe',
    bio: 'Just a regular guy.',
    email: 'a@a.com',
    password: 'password',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
    location: 'New York',
    entries: [
      { id: 1, username: 'john_doe', text: 'Just had an amazing meal at a new restaurant!', time: '12:30', location: 'New York, USA', profileImageUrl: 'https://example.com/profile.jpg' }
    ],
    friends: [
      { id: 1, username: 'JaneSmith', text: 'Visited a beautiful park.', time: '15:45', profileImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg', location: 'London, UK' },
      { id: 2, username: 'kar', text: 'Had a fun day at the beach.', time: '16:00', profileImageUrl: 'https://randomuser.me/api/portraits/men/2.jpg', location: 'Sydney, Australia' },
      { id: 3, username: 'EmilyBrown', text: 'Just finished reading a great book!', time: '10:15', profileImageUrl: 'https://randomuser.me/api/portraits/women/3.jpg', location: 'San Francisco, USA' },
      { id: 4, username: 'MikeJohnson', text: 'Explored a new hiking trail today.', time: '14:00', profileImageUrl: 'https://randomuser.me/api/portraits/men/4.jpg', location: 'Vancouver, Canada' },
      { id: 5, username: 'LisaWhite', text: 'Went to a fantastic concert last night.', time: '22:00', profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg', location: 'New York, USA' },
      { id: 6, username: 'TomHarris', text: 'Had a great workout session.', time: '07:30', profileImageUrl: 'https://randomuser.me/api/portraits/men/5.jpg', location: 'Los Angeles, USA' },
      { id: 7, username: 'SophiaGreen', text: 'Visited a new art gallery.', time: '18:30', profileImageUrl: 'https://randomuser.me/api/portraits/women/5.jpg', location: 'Paris, France' },
    ],
  });

  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

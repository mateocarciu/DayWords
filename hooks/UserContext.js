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
      { id: 1, username: 'john_doe', text: 'Just had an amazing meal at a new restaurant!', time: '2023-08-06T12:30:00Z', location: 'New York, USA', profileImageUrl: 'https://randomuser.me/api/portraits/men/12.jpg', parentEntry: null },
      { id: 2, username: 'john_doe', text: 'It was a wonderful experience!', time: '2023-08-06T12:45:00Z', location: 'New York, USA', profileImageUrl: 'https://randomuser.me/api/portraits/men/12.jpg', parentEntry: 1 },
      { id: 3, username: 'john_doe', text: 'Can’t wait to go back.', time: '2023-08-06T13:00:00Z', location: 'New York, USA', profileImageUrl: 'https://randomuser.me/api/portraits/men/12.jpg', parentEntry: 1 }
    ],
    friends: [
      { id: 1, username: 'JaneSmith', text: 'Visited a beautiful park.', time: '2023-08-06T15:45:00Z', profileImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg', location: 'London, UK' },
      { id: 2, username: 'kar', text: 'Had a fun day at the beach.', time: '2023-08-06T16:00:00Z', profileImageUrl: 'https://randomuser.me/api/portraits/men/2.jpg', location: 'Sydney, Australia' },
      { id: 3, username: 'EmilyBrown', text: 'Just finished reading a great book!', time: '2023-08-06T10:15:00Z', profileImageUrl: 'https://randomuser.me/api/portraits/women/3.jpg', location: 'San Francisco, USA' },
      { id: 4, username: 'MikeJohnson', text: 'Explored a new hiking trail today.', time: '2023-08-06T14:00:00Z', profileImageUrl: 'https://randomuser.me/api/portraits/men/4.jpg', location: 'Vancouver, Canada' },
      { id: 5, username: 'LisaWhite', text: 'Went to a fantastic concert last night.', time: '2023-08-05T22:00:00Z', profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg', location: 'New York, USA' },
      { id: 6, username: 'TomHarris', text: 'Had a great workout session.', time: '2023-08-06T07:30:00Z', profileImageUrl: 'https://randomuser.me/api/portraits/men/5.jpg', location: 'Los Angeles, USA' },
      { id: 7, username: 'SophiaGreen', text: 'Visited a new art gallery.', time: '2023-08-06T18:30:00Z', profileImageUrl: 'https://randomuser.me/api/portraits/women/5.jpg', location: 'Paris, France' },
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

// import { useEffect, useState } from 'react';
// import { useUser } from './UserContext';
// import createEchoInstance from './Echo';

// const useEcho = () => {
//   const { user } = useUser();
//   const [echo, setEcho] = useState(null);

//   useEffect(() => {
//     console.log('Connecting to ECHOINSTANCE');
//     if (user && user.token) {
//       const echoInstance = createEchoInstance(user.token);
//       setEcho(echoInstance);
//       console.log('Connected to ECHOINSTANCE');

//       return () => {
//         echoInstance.disconnect();
//       };
//     }
//   }, [user]);

//   return echo;
// };

// export default useEcho;

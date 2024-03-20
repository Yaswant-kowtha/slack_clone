import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { addUser, removeUser } from '../utils/userSlice';
import { LOGO } from '../utils/constants';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((store) => (store.user));

    const handleLoginButtonClick = () => {
        signOut(auth).then(() => {
        // Sign-out successful.
        navigate('/');
        }).catch((error) => {
        // An error happened.
        navigate('/error');
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            const { uid, email, displayName } = user;
            dispatch(
              addUser(
                [uid, email, displayName]
              )
            );
            navigate("/chat");
          } 
          else {
            dispatch(removeUser());
            navigate("/login");
          }
        });
    
        // Unsubscribe when component unmounts
        return () => unsubscribe();
      }, []);

    return (
        <div className="fixed top-0 left-0 w-full flex justify-between items-center p-4">
            <img src={LOGO}
                 alt="Logo" 
                 className="h-10 w-15 mr-4"/>
            <div className="flex font-bold text-lg">This is a clone of slack. Made only for educational purpose.</div>
            {!user && (
            <div className="flex items-center bg-violet-700 text-white rounded-lg m-2 p-2">
                <button onClick={handleLoginButtonClick}>Login</button>
            </div> )}
            {user && (
            <div className="flex items-center bg-violet-700 text-white rounded-lg m-2 p-2">
                <button onClick={handleLoginButtonClick}>Sign Out {user? user[2]: ""}</button>
            </div> )}
        </div>
    )
}

export default Header;
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";

const useFirebaseAuthentication = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged(auth, (authUser) => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    });
    return () => {
      unlisten();
    };
  }, []);

  return authUser;
};

export default useFirebaseAuthentication;

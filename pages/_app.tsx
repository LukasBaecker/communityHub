import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { useEffect, useContext, useState } from "react";
//Firebase and Firestore
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import {
  doc,
  getDoc,
  collection,
  FieldPath,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { createWrapper } from "next-redux-wrapper";
//Context and Redux
import { Provider } from "react-redux";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setUser } from "../store/actions/user";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "../store/configurateStore";
import { object } from "yup";
import { authorize, unauthorize } from "../store/slices/authSlice";

let persistor = persistStore(store);

function App({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.authState);
  const user = useAppSelector((state) => state.user);
  const statusRedux = useAppSelector((state) => state.status);
  const [status, setStatus] = useState("loading");

  const onAuthStateChange = () => {
    setStatus("loading");
    return onAuthStateChanged(auth, (u) => {
      console.log("authState has changed at firebase");
      if (u) {
        const docRef = doc(db, "user", u.uid);
        //get the additional userdata that is saved to the firestore referenced to the auth user's id
        getDoc(docRef).then((additionalUser) => {
          var gardenList = additionalUser.data().gardens;
          //TODO: delete this if not needed anymore var gardenList = [] as object[];

          var gardenArr = [] as object[];
          if (gardenList.length > 0) {
            const q = query(
              collection(db, "gardens"),
              where("__name__", "in", gardenList)
            );
            getDocs(q).then((gardens) => {
              gardens.forEach((g) => {
                gardenArr.push({
                  name: g.data().name,
                  description: g.data().description,
                  roles: g.data().roles,
                });
              });
              dispatch(
                setUser({
                  auth: u,
                  data: additionalUser.data(),
                  gardens: gardenArr,
                })
              );
              setStatus("idle");
            });
          } else {
            dispatch(
              setUser({
                auth: u,
                data: additionalUser.data(),
                gardens: gardenArr,
              })
            );
            setStatus("idle");
          }
        });
        dispatch(authorize());
      } else {
        dispatch(
          setUser({
            auth: {},
            data: { firstname: "", name: "", gardens: [] },
            gardens: [],
          })
        );
        dispatch(unauthorize());
        setStatus("idle");
      }
    });
  };

  useEffect(() => {
    if (statusRedux != "creatingNewUser") {
      const unsubscribe = onAuthStateChange();
      return () => {
        unsubscribe();
      };
    }
  }, [statusRedux]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}
const makeStore = () => store;
const wrapper = createWrapper(makeStore);
export default wrapper.withRedux(App);

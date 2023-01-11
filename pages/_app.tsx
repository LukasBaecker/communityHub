import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { useEffect, useContext, useState, useCallback } from "react";
//Firebase and Firestore
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import MySpinner from "../components/Spinner";
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
import { setUser } from "../store/slices/userSlice";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "../store/configurateStore";
import { object } from "yup";
import { authorize, unauthorize } from "../store/slices/authSlice";
import { done, loading, setStatus } from "../store/slices/statusSlice";

let persistor = persistStore(store);

function App({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.authState);
  const user = useAppSelector((state) => state.user);
  const status = useAppSelector((state) => state.status);
  const [localStatus, setLocalStatus] = useState("idle");

  const onAuthStateChange = (callback) => {
    setLocalStatus("loading");
    return onAuthStateChanged(auth, (u) => {
      console.log("authState has changed at firebase");
      if (u) {
        const docRef = doc(db, "user", u.uid);
        //get the additional userdata that is saved to the firestore referenced to the auth user's id
        getDoc(docRef).then((additionalUser) => {
          var groupList = additionalUser.data().groups;
          var groupArr = [] as object[];
          if (groupList.length > 0) {
            const q = query(
              collection(db, "gardens"),
              where("__name__", "in", groupList)
            );
            getDocs(q).then((groups) => {
              groups.forEach((g) => {
                groupArr.push({
                  name: g.data().name,
                  description: g.data().description,
                  roles: g.data().roles,
                });
              });
              dispatch(
                callback({
                  auth: u,
                  data: additionalUser.data(),
                  groups: groupArr,
                })
              );
              setLocalStatus("idle");
            });
          } else {
            dispatch(
              callback({
                auth: u,
                data: additionalUser.data(),
                groups: groupArr,
              })
            );
            setLocalStatus("idle");
          }
        });
        dispatch(authorize());
      } else {
        dispatch(
          callback({
            auth: {},
            data: { firstname: "", name: "", groups: [] },
            groups: [],
          })
        );
        dispatch(unauthorize());
        setLocalStatus("idle");
      }
    });
  };

  useEffect(() => {
    if (status != "createNewUser") {
      const unsubscribe = onAuthStateChange(setUser);
      return () => {
        unsubscribe();
      };
    }
  }, [status]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {status === "loading" || localStatus === "loading" ? (
          <MySpinner />
        ) : (
          <Component {...pageProps} />
        )}
      </PersistGate>
    </Provider>
  );
}
const makeStore = () => store;
const wrapper = createWrapper(makeStore);
export default wrapper.withRedux(App);

import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { useEffect, useContext, useState, useCallback } from "react";
//Firebase and Firestore
import { onAuthStateChanged } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
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
import { addGroup, setUserAuth, setUser } from "../store/slices/userSlice";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "../store/configurateStore";
import { object } from "yup";
import { authorize, unauthorize } from "../store/slices/authSlice";
import { done, loading, setStatus } from "../store/slices/statusSlice";
import AddGroup from "./addGroup";

let persistor = persistStore(store);

function App({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.authState);
  const [user, loading, error] = useAuthState(auth);
  const userRedux = useAppSelector((state) => state.user);
  const [localStatus, setLocalStatus] = useState("idle");

  useEffect(() => {
    setLocalStatus("loading"); //activates the overlaying spinner
    if (user) {
      const docRef = doc(db, "user", user.uid); //ref for firebase req
      //get the additional userdata that is saved to the firestore referenced to the auth user's id
      getDoc(docRef).then((additionalUser) => {
        //get all group data from the groups in grouplist if there are any groups
        //the grouplist contains only the IDs of the user's group
        var groupList = additionalUser.data().groups; //all group ids
        if (groupList.length > 0) {
          const q = query(
            collection(db, "groups"),
            where("__name__", "in", groupList)
          );
          getDocs(q).then((groupSnapshot) => {
            var groupSnapshotLength = groupSnapshot.docs.length;
            var groupPromise = new Promise((resolve, reject) => {
              groupSnapshot.docs.forEach((element, index) => {
                //if the user has a role in this group list the group with the role
                if (element.data().roles.hasOwnProperty(user.uid)) {
                  dispatch(
                    addGroup({
                      id: element.id,
                      name: element.data().name,
                      description: element.data().description,
                      roles: element.data().roles,
                      myRole: element.data().roles[user.uid],
                    })
                  );
                  if (index === groupSnapshotLength - 1) {
                    resolve("requesting Groups done");
                  }
                } else {
                  let groupRef = doc(db, "groups", element.id);
                  let joinReqRef = doc(groupRef, "joinRequests", user.uid);
                  getDoc(joinReqRef).then((myJoinReq) => {
                    if (myJoinReq && myJoinReq.data() != undefined) {
                      let status = myJoinReq.data().state;
                      dispatch(
                        addGroup({
                          id: element.id,
                          name: element.data().name,
                          description: element.data().description,
                          roles: element.data().roles,
                          myRole: status,
                        })
                      );

                      if (index === groupSnapshotLength - 1) {
                        resolve("requesting Groups done");
                      }
                    } else {
                      dispatch(
                        addGroup({
                          id: element.id,
                          name: element.data().name,
                          description: element.data().description,
                          roles: element.data().roles,
                          myRole: "nothing", //if there is no role set and no joinRequest by the given user, set the role as "nothing" to react on this when entering the group page
                        })
                      );

                      if (index === groupSnapshotLength - 1) {
                        resolve("requesting Groups done");
                      }
                    }
                  });
                }
              });
            });
            groupPromise.then((value) => {
              dispatch(
                setUserAuth({
                  auth: user.uid,
                  data: additionalUser.data(),
                })
              );
              setLocalStatus("idle");
            });
          });
        } else {
          dispatch(
            setUserAuth({
              auth: user.uid,
              data: additionalUser.data(),
            })
          );
          setLocalStatus("idle");
        }
      });
      dispatch(authorize());
    } else {
      dispatch(
        setUser({
          auth: {},
          data: { firstname: "", name: "", groups: [] },
          groups: [],
        })
      );
      dispatch(unauthorize());
      setLocalStatus("idle");
    }
  }, [user]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {localStatus === "loading" ? (
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

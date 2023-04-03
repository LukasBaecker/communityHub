import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
//Firebase
import { auth, db } from "../firebase/firebase-config";
import {
  EmailAuthCredential,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  collection,
  getDocs,
  setDoc,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
//Bootstrap
import { Button, Form } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
//Redux and Context
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { authorize } from "../store/slices/authSlice";
import { creatingNewUser, done, loading } from "../store/slices/statusSlice";
import { setAlert, clearAlert } from "../store/slices/alertSlice";
import { setUser } from "../store/slices/userSlice";
//Form dependencies
import { Formik } from "formik";
import * as yup from "yup";
//Components
import Drawer from "../components/DrawerNavigation";
import MySpinner from "../components/Spinner";

const validationSchemaDE = yup.object().shape({
  name: yup.string().required("Bitte gib einen Namen für deine Gruppe ein."),
});

type valuesType = {
  name: string;
};
type alertType = {
  visible: boolean;
  level: "danger" | "warning" | "success" | "none";
  message: string;
};
interface UserState {
  auth: object;
  data: { firstname: string; name: string; groups: string[] };
  groups: object[];
}

const SearchGroup: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.status);
  //const authState = useAppSelector((state) => state.authState);
  const user = useAppSelector((state) => state.user);
  const [localAlert, setLocalAlert] = useState<alertType>({
    visible: false,
    level: "none",
    message: "",
  });
  const [dialog, setDialog] = useState({
    visible: false as boolean,
    title: "hey there" as string,
    text: "This is a description" as string,
    groupId: "" as string,
  });
  const pushAlert = (al: alertType) => {
    console.log(al);
    setLocalAlert(al);
    //dispatch(setAlert(al));

    setTimeout(() => {
      setLocalAlert({ ...al, visible: false });
    }, 5000);
  };
  console.log('"this also reloads":', "this also reloads");

  /**
   * function that takes a group id and creates a request entry to this group
   * the request can only be created when the status of the request is "pending"
   * that means, that the user that is sending the request wants to join the group.
   * An admin of that groups needs to accept the user. Till then the request is pending
   * and can not be changed.
   **/
  const sendJoinRequest = (groupId: string) => {
    dispatch(loading());
    console.log("want to join");
    try {
      setDialog({ ...dialog, visible: false });
      console.log("user.auth.uid:", user.auth);
      const userRef = doc(db, "user", user.auth);
      //if the user is not member of the group already
      console.log("user.data.groups:", user.data.groups);
      if (!user.data.groups.includes(groupId)) {
        //add the groupID to the list of groups, the user is member of
        updateDoc(userRef, {
          groups: [...user.data.groups, groupId],
        })
          .then(() => {
            // Add a new document in collection "groups/{groupId}/joinRequests"
            var groupRef = doc(db, "groups", groupId);
            //the request safes the request with the users id and the status "pending"
            //if the status is other than "pending" the request will be denied
            setDoc(doc(groupRef, "joinRequests", user.auth), {
              state: "pending",
            })
              //TODO: hier muss noch die Logik ergänzt werden, dass die Gruppe auch schon in die Liste des Nutzers mit aufgenommen wird
              //wenn dann die Gruppen abgefragt werden muss die Logik hinzugefügt werden um zu checken ob die person rechte hat und wenn nicht dann unter den offennen Anfragen schaut welchen Zustand die eigene Anfrage hat. Bei pending passiert nichts und falls die Anfrage abgelehnt wurde, wird die Gruppe aus der Liste gelöscht
              // Außerdem muss das Recht in der Datenbank eigene Anffragen die Abgelehnt wurden ergänzrt werden um auch den join requesst löschen zu können.
              .then(() => {
                pushAlert({
                  visible: true,
                  level: "success",
                  message: "Anfrage wurde erfolgreich gesendet.",
                });
                dispatch(done());
              })
              .catch((err) => {
                pushAlert({
                  visible: true,
                  level: "danger",
                  message: "Es ist ein Fehler aufgetreten.",
                });
                console.log("1: ", err);
                dispatch(done());
              });
          })
          .catch((err) => {
            pushAlert({
              visible: true,
              level: "danger",
              message: "Es ist ein Fehler aufgetreten.",
            });
            console.log("2: ", err);
            dispatch(done());
          });
      }
      //If the user is already a member of the group send an alert
      else {
        console.log("Already member of this group is detected.");
        pushAlert({
          visible: true,
          level: "warning",
          message:
            "Bereits Mitglied oder die Anfrage ist noch nicht bestätigt.",
        });
        dispatch(done());
      }
    } catch {
      (err) => {
        dispatch(done());
        setDialog({ ...dialog, visible: false });
        pushAlert({
          visible: true,
          level: "danger",
          message: "Es ist ein Fehler aufgetreten.",
        });
        console.log("err:", err);
      };
    }
  };

  if (status === "loading") {
    return <MySpinner />;
  }

  return (
    <>
      {localAlert.visible ? (
        <Alert variant={localAlert.level}>{localAlert.message}</Alert>
      ) : (
        <></>
      )}
      <Modal
        show={dialog.visible}
        onHide={() => {
          setDialog({ ...dialog, visible: false });
        }}
        backdrop='static'
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{dialog.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{dialog.text}</Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              setDialog({ ...dialog, visible: false });
            }}>
            Abbrechen
          </Button>
          <Button
            variant='primary'
            onClick={() => {
              sendJoinRequest(dialog.groupId);
            }}>
            Ja, Anfrage jetzt senden.
          </Button>
        </Modal.Footer>
      </Modal>
      <Drawer />
      <Container className='signPagesContainer'>
        <Row>
          <Col>
            <h2 className='mt-6 text-center text-3xl leading-9 font-   extrabold text-gray-900'>
              Finde eine existierende Gruppe
            </h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Formik
              initialValues={{
                name: "",
              }}
              validationSchema={validationSchemaDE}
              onSubmit={(values: valuesType, { setSubmitting, resetForm }) => {
                try {
                  console.log("checking for the group");
                  dispatch(loading());
                  const q = query(
                    collection(db, "groups"),
                    where("name", "==", values.name)
                  );
                  getDocs(q)
                    .then((res) => {
                      if (res.docs[0] != null) {
                        setDialog({
                          visible: true,
                          title: res.docs[0].data().name,
                          text: "Möchtest du dieser Gruppe beitreten?",
                          groupId: res.docs[0].id,
                        });
                      } else {
                        console.log("Gruppe existiert nicht");
                        pushAlert({
                          visible: true,
                          level: "warning",
                          message: "Gruppe existiert nicht.",
                        });
                      }
                      dispatch(done());
                      setSubmitting(false);
                    })
                    .catch((err) => {
                      console.log("err:", err);
                      pushAlert({
                        visible: true,
                        level: "danger",
                        message:
                          "Es ist ein Fehler aufgetreten. Versuch es erneut oder wende dich an den App-Betreiber",
                      });
                      dispatch(done());
                      setSubmitting(false);
                    });
                } catch (error) {
                  console.log(error);
                  pushAlert({
                    visible: true,
                    level: "danger",
                    message:
                      "Es ist ein Fehler aufgetreten. Versuch es erneut oder wende dich an den App-Betreiber",
                  });

                  dispatch(done());
                  setSubmitting(false);
                }
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                values,
                errors,
                touched,
              }) => (
                <Form onSubmit={handleSubmit} className='mx-auto'>
                  <Form.Group className='form-group' controlId='formname'>
                    <Form.Label>Gruppenname: </Form.Label>
                    <Form.Control
                      type='text'
                      name='name'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      className={touched.name && errors.name ? "errorForm" : ""}
                    />
                    {touched.name && errors.name ? (
                      <div className='errorForm-message'>{errors.name}</div>
                    ) : null}
                  </Form.Group>
                  <Button
                    className='form-group'
                    variant='secondary'
                    type='submit'
                    disabled={isSubmitting}>
                    Gruppe finden
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
};

export default SearchGroup;

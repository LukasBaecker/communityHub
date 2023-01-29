import { useContext, useState } from "react";
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
//Redux and Context
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { authorize } from "../store/slices/authSlice";
import { creatingNewUser, done, loading } from "../store/slices/statusSlice";
import { setUser } from "../store/slices/userSlice";
//Form dependencies
import { Formik } from "formik";
import * as yup from "yup";

const validationSchemaDE = yup.object().shape({
  email: yup
    .string()
    .required("Email ist für die Registrierung erforderlich.")
    .email("Email nicht korrekt."),
  name: yup.string().required("Bitte gib einen Namen für deinen Garten ein."),
  description: yup.string().required("Beschreibe deine neue Gruppe."),
  phone: yup.string().required("Bitte gib eine Telefonnummer an."),
});

type valuesType = {
  email: string;
  phone: string;
  name: string;
  description: string;
};
type alertType = {
  level: "danger" | "warning" | "success" | "none";
  message: string;
};

const AddGroup: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.authState);
  const user = useAppSelector((state) => state.user);
  const [alerts, setAlert] = useState<alertType>({
    level: "none",
    message: "",
  });

  return (
    <Container className='signPagesContainer'>
      <Row>
        <Col>
          <h2 className='mt-6 text-center text-3xl leading-9 font-   extrabold text-gray-900'>
            Neue Gruppe erstellen
          </h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={{ email: "", name: "", description: "", phone: "" }}
            validationSchema={validationSchemaDE}
            onSubmit={(values: valuesType, { setSubmitting, resetForm }) => {
              try {
                dispatch(loading());
                //create the datastructure for a new garden
                const data = {
                  name: values.name,
                  description: values.description,
                  phone: values.phone,
                  email: values.email,
                  roles: {},
                  creator: user.auth.uid,
                };
                //add the current user to roles as an owner
                data.roles[user.auth.uid] = "owner";

                //define the query for the firestore with condition to check if garden with the given name exists
                const q = query(
                  collection(db, "groups"),
                  where("name", "==", values.name)
                );
                //search the garden collection for the given gardenname
                getDocs(q).then((res) => {
                  if (res.docs[0] != null) {
                    //if the gardenname is already in use nothing will be added
                    //TODO: change Alert.alert(res.docs[0].data().name, "existiert bereits.");
                    console.log("Group already exists.");
                    setSubmitting(false);
                    dispatch(done());
                  } else {
                    //create a garden and safe it to the database
                    // Add a new document in collection "groups/"
                    var collectionRef = collection(db, "groups");
                    addDoc(collectionRef, data)
                      .then((gardenRef) => {
                        let newGarden = [data];
                        let gardenIdArr = user.data.groups.concat([
                          gardenRef.id,
                        ]); //arr of IDs of groups of the auth. user with the newly created garden
                        let groupDataArr = user.groups.concat(newGarden); //arr of garden data objects of the auth. user with the newly created garden
                        //update the Redux store -> adding the new garden to user's data and the arr of garden information
                        dispatch(
                          setUser({
                            auth: { ...user.auth },
                            data: { ...user.data, groups: gardenIdArr },
                            groups: groupDataArr,
                          })
                        );
                        //create the reference to the authorized user
                        let userRef = doc(db, "user", user.auth.uid);
                        //update the user-collection at "user/{userId}"
                        //updating only the array of groups the user is a member of with the newly created garden
                        updateDoc(userRef, {
                          groups: gardenIdArr,
                        })
                          .then(() => {
                            console.log("group has been created");
                            dispatch(done());
                            //TODO: Alerts mit HTML-alerts ersetzen
                            //Alert.alert("Es ist leider ein Fehler aufgetreten.");
                          })
                          .catch((error) => {
                            console.log(error.message);
                            setSubmitting(false);
                            dispatch(done());
                            //TODO: Alert.alert("Da ist leider etwas schiefgegangen.");
                          });
                      })
                      .catch((error) => {
                        console.log(error.message);
                        setSubmitting(false);
                        dispatch(done());
                        //TODO: Alert.alert("Da ist leider etwas schiefgegangen.");
                      });
                  }
                });
              } catch (error) {
                console.log(error);
                setSubmitting(false);
                dispatch(done());
                //TODO: Alert.alert("Register Failed", error);
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
                <Form.Group className='form-group' controlId='formName'>
                  <Form.Label>Beschreibung: </Form.Label>
                  <Form.Control
                    type='text'
                    name='description'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                    className={
                      touched.description && errors.description
                        ? "errorForm"
                        : ""
                    }
                  />
                  {touched.description && errors.description ? (
                    <div className='errorForm-message'>
                      {errors.description}
                    </div>
                  ) : null}
                </Form.Group>
                <Form.Group className='form-group' controlId='formEmail'>
                  <Form.Label>Kontak-Email: </Form.Label>
                  <Form.Control
                    type='text'
                    name='email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className={touched.email && errors.email ? "errorForm" : ""}
                  />
                  {touched.email && errors.email ? (
                    <div className='errorForm-message'>{errors.email}</div>
                  ) : null}
                </Form.Group>
                <Form.Group className='form-group' controlId='formPhone'>
                  <Form.Label>Telefonnummer: </Form.Label>
                  <Form.Control
                    type='text'
                    name='phone'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    className={touched.phone && errors.phone ? "errorForm" : ""}
                  />
                  {touched.phone && errors.phone ? (
                    <div className='errorForm-message'>{errors.phone}</div>
                  ) : null}
                </Form.Group>
                <Button
                  className='form-group'
                  variant='secondary'
                  type='submit'
                  disabled={isSubmitting}>
                  Gruppe anlegen
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};
export default AddGroup;

//TODO: go on here: check if at a new signup everything set up at the advanced information at the user doc in firestore so that it is never empty
//TODO: Alerts fertig basteln siehe auch scss file

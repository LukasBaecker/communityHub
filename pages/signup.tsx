import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
//Firebase
import { auth, db } from "../firebase/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
//Bootstrap
import { Button, Form } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";

//Redux and Context
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { authorize } from "../store/slices/authSlice";
import { creatingNewUser, done } from "../store/slices/statusSlice";
//Form dependencies
import { Formik } from "formik";
import * as yup from "yup";

const validationSchemaDE = yup.object().shape({
  email: yup
    .string()
    .required("Email ist für die Registrierung erforderlich.")
    .email("Email nicht korrekt."),
  name: yup.string().required("Bitte gib einen Namen für deinen Garten ein."),
  firstname: yup.string().required("Bitte gib deinen Vornamen an."),
  password: yup.string().required("Ein Passwort ist notwendig."),
});

type valuesType = {
  email: string;
  password: string;
  firstname: string;
  name: string;
};
type alertType = {
  level: "danger" | "warning" | "success" | "none";
  message: string;
};

const SignUp: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.authState);
  const [alerts, setAlert] = useState<alertType>({
    level: "none",
    message: "",
  });

  return (
    <Container className='signPagesContainer'>
      <Row>
        <Col>
          <h2 className='mt-6 text-center text-3xl leading-9 font-   extrabold text-gray-900'>
            Sign up
          </h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className='mt-2 text-center text-md text-gray-600'>
            already have an account? <Link href='/login'>Log in</Link>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={{ email: "", password: "", name: "", firstname: "" }}
            validationSchema={validationSchemaDE}
            onSubmit={(values: valuesType, { setSubmitting, resetForm }) => {
              try {
                // TODO: hier wird der Auth user angelegt, aber es müssen noch
                /** weitere Formular Felder hinzugefügt werden, damit auch entsprechend Userdaten
                 * im Firestore gespeichert werden können
                 */
                dispatch(creatingNewUser());
                createUserWithEmailAndPassword(
                  auth,
                  values.email,
                  values.password
                )
                  .then((userCred) => {
                    console.log(
                      "the new user got following userRef.user.uid:",
                      userCred.user.uid
                    );
                    //create a user-document in the firestore collection "user"
                    //where the newly created UID is beeing used to safe the users data with this id
                    let userRef = doc(db, "user", userCred.user.uid);
                    setDoc(userRef, {
                      name: values.name,
                      firstname: values.firstname,
                      groups: [],
                    })
                      .then((u) => {
                        dispatch(done());
                        setSubmitting(false);
                        dispatch(authorize());
                        router.push("/");
                      })
                      .catch((err) => {
                        console.log(
                          "Error at creating additional user data: ",
                          err.message
                        );
                        dispatch(done());

                        //TODO: Alerts mit HTML-alerts ersetzen
                        //Alert.alert("Es ist leider ein Fehler aufgetreten.");
                      });
                  })
                  .catch((err) => {
                    if (
                      err.message ==
                      "Firebase: Error (auth/email-already-in-use)."
                    ) {
                      //TODO: Alert.alert("Email wird bereits verwendet.");
                      router.push("/signup");
                      setSubmitting(false);
                      dispatch(done());
                    } else {
                      console.log(err.message);
                      setSubmitting(false);
                      dispatch(done());
                      //TODO: Alert.alert("Da ist leider etwas schiefgegangen.");
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
                <Form.Group className='form-group' controlId='formFirstname'>
                  <Form.Label>Vorname: </Form.Label>
                  <Form.Control
                    type='text'
                    name='firstname'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstname}
                    className={
                      touched.firstname && errors.firstname ? "errorForm" : ""
                    }
                  />
                  {touched.firstname && errors.firstname ? (
                    <div className='errorForm-message'>{errors.firstname}</div>
                  ) : null}
                </Form.Group>
                <Form.Group className='form-group' controlId='formName'>
                  <Form.Label>Nachname: </Form.Label>
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
                <Form.Group className='form-group' controlId='formEmail'>
                  <Form.Label>Email: </Form.Label>
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
                <Form.Group
                  className='form-group'
                  controlId='formBasicPassword'>
                  <Form.Label>Passwort</Form.Label>
                  <Form.Control
                    type='password'
                    name='password'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    className={
                      touched.password && errors.password ? "errorForm" : ""
                    }
                  />
                  {touched.password && errors.password ? (
                    <div className='errorForm-message'>{errors.password}</div>
                  ) : null}
                </Form.Group>
                <Button
                  className='form-group'
                  variant='secondary'
                  type='submit'
                  disabled={isSubmitting}>
                  Registrieren
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};
export default SignUp;

//TODO: go on here: check if at a new signup everything set up at the advanced information at the user doc in firestore so that it is never empty
//TODO: Alerts fertig basteln siehe auch scss file

import Link from "next/link";
import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
//Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { connectFirestoreEmulator } from "firebase/firestore";
//Bootstrap
import { Button, Form } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
//Components
import MySpinner from "../components/Spinner";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { authorize } from "../store/slices/authSlice";
import { done, loading } from "../store/slices/statusSlice";
import { Formik } from "formik";
import * as yup from "yup";
import { setStatus } from "../store/slices/statusSlice";

const validationSchemaDE = yup.object().shape({
  email: yup.string().email("Email nicht korrekt."),
  password: yup.string().required("Ein Passwort ist notwendig."),
});

type valuesType = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authState = useAppSelector((state) => state.authState);
  const status = useAppSelector((state) => state.status);

  if (status === "loading") {
    return <MySpinner />;
  }

  if (authState) {
    router.push("/");
  }

  return (
    <Container className='signPagesContainer'>
      <Row>
        <Col>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Log in
          </h2>
          <p className='mt-2 text-center text-md text-gray-600'>
            {"Noch keinen Account? "}
            <Link href='/signup'>Jetzt registrieren</Link>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchemaDE}
            onSubmit={(values: valuesType, { setSubmitting, resetForm }) => {
              try {
                setSubmitting(true);
                dispatch(loading());
                console.log("trying to do it");
                signInWithEmailAndPassword(auth, values.email, values.password)
                  .then((userCredential) => {
                    const user = userCredential.user;
                    console.log(user);
                    setSubmitting(false);
                    resetForm();
                    dispatch(authorize());
                    dispatch(done());
                    router;
                  })
                  .catch((err) => {
                    console.log("inner Error: ", err);
                    dispatch(done());
                    setSubmitting(false);
                    if (
                      err.message === "Firebase: Error (auth/wrong-password)."
                    ) {
                      //TODO: Alert.alert("Login fehlgeschlagen: Falsches Passwort!");
                    } else {
                      if (
                        err.message === "Firebase: Error (auth/user-not-found)."
                      ) {
                        //TODO: Alert.alert("E-Mail Adresse ist nicht registriert.");
                      } else {
                        console.log("this is the error ", err);
                        //TODO: Alert.alert("Login fehlgeschlagen");
                      }
                    }
                  });
              } catch (error) {
                console.log("outer Error: ", error);
                setSubmitting(false);
                dispatch(done());
                //TODO: Alert.alert("Login Failed", error);
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
                <Form.Group className='form-group' controlId='formEmail'>
                  <Form.Label>Email :</Form.Label>
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
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};
export default LoginPage;

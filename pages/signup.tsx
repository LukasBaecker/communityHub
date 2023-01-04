import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
//Firebase
import { auth, db } from "../firebase/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
//Bootstrap
import { Button } from "react-bootstrap";
//Redux and Context
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { authorize } from "../store/slices/authSlice";
import { creatingNewUser, done } from "../store/slices/statusSlice";
//Form dependencies
import { Formik } from "formik";
import * as yup from "yup";

const validationSchemaDE = yup.object().shape({
  email: yup.string().email("Email nicht korrekt."),
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

const SignUp: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.authState);
  const handleRegister = async (values: valuesType) => {
    //TODO: checken Formik typescript was man hier mit values machen muss damit es keinen Fehler gibt
    try {
      /**TODO: hier wird der Auth user angelegt, aber es müssen noch
       * weitere Formular Felder hinzugefügt werden, damit auch entsprechend Userdaten
       * im Firestore gespeichert werden können
       */
      dispatch(creatingNewUser());
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((userCred) => {
          console.log(
            "the new user got following userRef.user.uid:",
            userCred.user.uid
          );
          //create a user-document in the firestore collection "user"
          //where the newly created UID is beeing used to safe the users data with this id
          let userRef = doc(db, "user", userCred.user.uid);
          //TODO: hier jetzt noch weitere Formularfelder hinzufügen, damit Nutzer*innen auch individuelle
          //Namen haben und nicht alle Labadaba Erik heißen
          setDoc(userRef, {
            name: values.name,
            firstname: values.firstname,
            gardens: [],
          })
            .then((u) => {
              dispatch(done());
            })
            .catch((err) => {
              console.log(
                "Error at creating additional user data: ",
                err.message
              );
              //TODO: Alerts mit HTML-alerts ersetzen
              //Alert.alert("Es ist leider ein Fehler aufgetreten.");
            });
          dispatch(authorize());
        })
        .catch((err) => {
          if (err.message == "Firebase: Error (auth/email-already-in-use).") {
            //TODO: Alert.alert("Email wird bereits verwendet.");
            router.push("/signup");
            dispatch(done());
          } else {
            console.log(err.message);
            //TODO: Alert.alert("Da ist leider etwas schiefgegangen.");
          }
        });
    } catch (error) {
      console.log(error);
      //TODO: Alert.alert("Register Failed", error);
    }
  };
  return (
    <div className='min-h-screen flex bg-gray-200'>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='text-center mt-24'>
          <h2 className='mt-6 text-center text-3xl leading-9 font-   extrabold text-gray-900'>
            Sign up
          </h2>
          <p className='mt-2 text-center text-md text-gray-600'>
            already have an account? <Link href='/login'>Log in</Link>
          </p>
        </div>
        <div className='mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <Formik
            initialValues={{ name: "", firstname: "", email: "", password: "" }}
            validationSchema={validationSchemaDE}
            onSubmit={(values) => handleRegister(values)}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <div>
                  <input
                    name='firstname'
                    onChange={handleChange("firstname")}
                    onBlur={handleBlur("firstname")}
                    value={values.firstname}
                    placeholder='Vorname'
                    autoCapitalize='none'
                  />
                  {errors.firstname && touched.firstname && (
                    <p>{errors.firstname}</p>
                  )}
                  <input
                    name='name'
                    onChange={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholder='Name'
                    autoCapitalize='none'
                  />
                  {errors.name && touched.name && <p>{errors.name}</p>}
                  <input
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    placeholder='Email'
                    type='email'
                    name='email'
                    autoCapitalize='none'
                  />
                  {errors.email && touched.email && <p>{errors.email}</p>}
                  <input
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    placeholder='Passwort'
                    type='password'
                    name='password'
                    autoCapitalize='none'
                  />
                  {errors.password && touched.password && (
                    <p>{errors.password}</p>
                  )}
                </div>
                <Button title='Registrieren' onClick={() => handleSubmit()} />
              </>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default SignUp;

//TODO: go on here https://betterprogramming.pub/implement-user-authentication-with-next-js-and-firebase-fb9414adba08

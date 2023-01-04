import React, { useState, useEffect, useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { unauthorize } from "../store/slices/authSlice";
import { loading, done } from "../store/slices/statusSlice";
function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authState = useAppSelector((state) => state.authState);
  const status = useAppSelector((state) => state.status);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push("/login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  //console.log("auth:", auth);
  /**
   * if(unauthorized){
   * router.push("/login")}
   */

  const logout = async () => {
    dispatch(loading());
    signOut(auth).then((response) => {
      dispatch(unauthorize());
      dispatch(done());
      router.push("/login");
    });
  };

  if (authState !== true) {
    router.push("/login");
  }
  return (
    <>
      <p>Homescreen. Success you logged in!</p>
      <Button onClick={() => logout()}>Logout</Button>
    </>
  );
}

export default Home;

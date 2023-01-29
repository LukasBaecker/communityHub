import React, { useState, useEffect, useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { unauthorize } from "../store/slices/authSlice";
import { loading, done } from "../store/slices/statusSlice";
import Drawer from "../components/DrawerNavigation";
import MySpinner from "../components/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authState = useAppSelector((state) => state.authState);
  const status = useAppSelector((state) => state.status);

  if (authState !== true) {
    router.push("/login");
    dispatch(done());
  } else {
    return (
      <>
        <Drawer />
        <Container id='indexContainer'>
          <Row className='jumbotron'>
            <div className='jumbotron-color jumbotron-color-2'></div>
            <div className='jumbotron-color jumbotron-color-3'></div>
            <div className='jumbotron-color jumbotron-color-4'></div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Home;

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
//firebase imports
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
//Redux imports
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { unauthorize } from "../store/slices/authSlice";
import { loading, done } from "../store/slices/statusSlice";
//components & bootstrap imports
import Drawer from "../components/DrawerNavigation";
import MySpinner from "../components/Spinner";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
//icons imports
import { IoIosArrowForward } from "react-icons/io";

interface UserRequesting {
  groupId: string;
  firstname: string;
  name: string;
  id: string;
}

function Home() {
  const today = new Date();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authState = useAppSelector((state) => state.authState);
  const user = useAppSelector((state) => state.user);
  const status = useAppSelector((state) => state.status);
  const [joinRequest, setJoinRequest] = useState<Array<UserRequesting>>([]);

  useEffect(() => {
    user.data.groups.map((groupId: string) => {
      const q = query(collection(db, "groups/" + groupId + "/joinRequests"));
      getDocs(q).then((joinReqsSnapshots) => {
        var joinReqArr: Array<string> = [];
        var userReqArr: Array<UserRequesting> = joinRequest;
        joinReqsSnapshots.forEach((queryDocumentSnapshot) => {
          console.log(
            "getthisdone",
            queryDocumentSnapshot.id,
            queryDocumentSnapshot.data()
          );
          joinReqArr.push(queryDocumentSnapshot.id);
        });
        joinReqArr.forEach((j) => {
          let docRef = doc(db, "user", j);
          getDoc(docRef).then((userReq) => {
            let user: UserRequesting = {
              groupId: groupId,
              firstname: userReq.data().firstname,
              name: userReq.data().name,
              id: j,
            };
            userReqArr.push(user);
          });
          setJoinRequest(userReqArr);
          console.log("userReqArr:", userReqArr);
        });
      });
    });
  }, []);

  const requestList = () => {
    user.groups;

    return 0;
  };

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
            <div className='jumbotron-color jumbotron-color-4'>
              <Row id='headerRow'>
                <Col className='h1Col'>
                  {" "}
                  <h1>Hi {user.data.name}, das sind deine Aufgaben:</h1>
                </Col>
              </Row>
              <Row id='taskOverviewRow'>
                <Link
                  className='taskLink'
                  href={{
                    pathname: `/me/tasks`,
                    query: { filter: "today" },
                  }}>
                  <h2>Heute</h2>

                  <p>2</p>
                  <IoIosArrowForward className='taskArrow' />
                </Link>
                <Link
                  className='taskLink'
                  href={{
                    pathname: `/me/tasks`,
                    query: { filter: "thisWeek" },
                  }}>
                  <h2>Alle</h2>
                  <p>9+</p>
                  <IoIosArrowForward className='taskArrow' />
                </Link>
              </Row>
            </div>
          </Row>
          <Row className='upcomingEventsRow'>
            <Row>
              <Col>
                <h1>Bevorstehende Termine</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                {" "}
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <Card.Title>Gartenparty</Card.Title>
                    <Card.Subtitle className='mb-2 text-muted'>
                      {today.getDate() +
                        "." +
                        today.getMonth() +
                        "." +
                        today.getFullYear()}
                    </Card.Subtitle>
                    <Card.Text>
                      Dieses Event ist ein Testevent und wird dem entsprechend
                      hier angezeigt
                    </Card.Text>
                    <Card.Link href='#'>mehr Informationen</Card.Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Row>
          <Row className='requestsRow'>
            <Col>
              <h1>Beitrittsanfragen für deine Gruppen</h1>
              {joinRequest.map((req) => {
                //TODO: hier müssen nocch einige Punkte gemacht werden
                // 1. anstelle der Gruppen ID den entsprechenden Gruppennamen laden und anzeigen
                // 2. überprüfen, ob der Gruppenname der letzten anfrage der gleiche war und wenn ja diesen nicth nochmal Rendern sondern nur bei der ersten anfrage der liste zu diesem Garten den Gartennamen anzeigen
                // 2.b oder den Gruppennamen mit in die Karte schreiben
                // 3. die anfragen als karten gestallten und dann noch einen knopf zum annehmen und einen zum ablehnen hinzufügen.
                // 3.b die Logik für das annehmen und ablehnen implementieren. Ablehnen nur die Anfrage aus der Datenbank löschen, Annehmen den Eintrag löschen und Person in die Liste der Mitglieder mit aufnehmen
                return (
                  <div key={req.groupId + " " + req.id}>
                    <h2>{req.groupId}</h2>
                    <p>{req.firstname + " " + req.name} </p>
                    <Button></Button>
                  </div>
                );
              })}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Home;

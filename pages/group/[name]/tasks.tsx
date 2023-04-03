import { useRouter } from "next/router";
import Drawer from "../../../components/DrawerNavigation";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Toolbar from "../../../components/Toolbar";
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { BsCheckCircleFill, BsCircle } from "react-icons/bs";
export default function Tasks() {
  /**the status of a type can be either that
   * it is done,
   * it is still open,
   * it is not assignet ot anyone or
   * that the personen who should do can not make it and wants somebody else to do it
   */
  type taskStatusType = "done" | "open" | "unassigned" | "unfulfillable";
  interface Task {
    who: string;
    date: Date;
    description: string;
    status: taskStatusType;
  }
  let placeholderList: Task[];
  const today = new Date();
  const router = useRouter();
  const groupName = router.query.name;

  placeholderList = [
    {
      who: "Lukas",
      date: new Date(),
      description: "Dies ist ein normaler Gießauftrag",
      status: "open",
    },
    {
      who: "Lukas",
      date: new Date("2023-01-30"),
      description: "Dies ist ein normaler Gießauftrag",
      status: "done",
    },
    {
      who: "Lukas",
      date: new Date("2023-02-15"),
      description: "Dies ist ein normaler Gießauftrag",
      status: "done",
    },
    {
      who: "Lukas",
      date: new Date("2023-02-16"),
      description: "Dies ist ein normaler Gießauftrag",
      status: "open",
    },
    {
      who: "Lukas",
      date: new Date("2023-02-17"),
      description: "Dies ist ein normaler Gießauftrag",
      status: "open",
    },
    {
      who: "Lukas",
      date: new Date("2023-02-18"),
      description: "Dies ist ein normaler Gießauftrag",
      status: "open",
    },
    {
      who: "Lukas",
      date: new Date("2023-02-19"),
      description: "Dies ist ein normaler Gießauftrag",
      status: "open",
    },
    {
      who: "Lukas",
      date: new Date("2023-02-20"),
      description: "Dies ist ein normaler Gießauftrag",
      status: "open",
    },
    {
      who: "Lukas",
      date: new Date("2023-03-25"),
      description: "Dies ist ein normaler Gießauftrag",
      status: "open",
    },
    {
      who: "Lukas",
      date: new Date("2023-04-29"),
      description: "Dies ist ein normaler Gießauftrag",
      status: "open",
    },
    {
      who: "Lukas",
      date: new Date("2024-01-11"),
      description: "Dies ist ein normaler Gießauftrag",
      status: "open",
    },
  ];
  const [tasks, setTasks] = useState(placeholderList);

  const isToday = (date: Date) => {
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return true;
    }
    return false;
  };
  return (
    <>
      <Drawer />
      <Toolbar />
      <Container id='taskContainer'>
        <Row>
          <h2>Gießen</h2>
        </Row>
        {placeholderList.map((task: Task, index: number) => {
          return (
            <Row key={index}>
              <Col>
                <Card className='taskCard'>
                  <Card.Body>
                    <Row>
                      <Col className='checkerCol'>
                        {task.status === "done" ? (
                          <BsCheckCircleFill className='taskChecker checked' />
                        ) : (
                          <BsCircle className='taskChecker unchecked' />
                        )}
                      </Col>
                      <Col>
                        <Card.Title>
                          {isToday(task.date)
                            ? "Heute"
                            : task.date.getDate().toString() +
                              "." +
                              (task.date.getMonth() + 1).toString() +
                              "." +
                              task.date.getFullYear().toString()}
                        </Card.Title>
                        <Card.Subtitle className='mb-2 text-muted'>
                          {task.who}
                        </Card.Subtitle>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          );
        })}
      </Container>
      <AddTaskButton />
    </>
  );
}

/**
 * 
 //TODO: Comment this 
 */
const AddTaskButton = () => {
  const [clicked, setClicked] = useState(false);
  const router = useRouter();
  const [adding, setAdding] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <div
        className={!clicked ? "btnAdd" : "btnAdd clicked"}
        onClick={() => setClicked(!clicked)}>
        <span className={"close"}></span>
      </div>
      <div className={!clicked ? "menuAdd" : "menuAdd clicked"}>
        <Button
          variant='primary'
          onClick={() => {
            handleShow();
            setAdding("group");
          }}>
          {"Task-Gruppe hinzufügen"}
        </Button>
        <br />
        <Button
          className='lowerButtonAdd'
          variant='primary'
          onClick={() => {
            handleShow();
            setAdding("task");
          }}>
          {"Task erstellen"}
        </Button>
      </div>
      <Modal
        show={show}
        onHide={() => {
          handleClose();
          setAdding("");
        }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {adding === "group"
              ? "Neue Aufgaben-Gruppe erstellen."
              : "Aufgabe hinzufügen."}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {adding === "group" ? (
            <p>
              Hier kommt ein Formular hin, mit dem man eine neue Aufgaben-Gruppe
              erstellen kann.
            </p>
          ) : (
            <p>
              Hier kommt ein Formular hin, mit dem man eine Aufgabe hinzufügen
              kann.
            </p>
          )}
          <Button variant='warning' onClick={handleClose}>
            Abbrechen
          </Button>
          <Button variant='primary' onClick={handleClose}>
            Hinzufügen
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

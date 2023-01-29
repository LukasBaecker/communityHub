import { useRouter } from "next/router";
import Drawer from "../../../components/DrawerNavigation";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Toolbar from "../../../components/Toolbar";
import { useState } from "react";

export default function Tasks() {
  const router = useRouter();
  const groupName = router.query.name;

  return (
    <>
      <Drawer />
      <Toolbar />
      <p>This is the Tasks Page for {"" + groupName}</p>
      <AddTaskButton />
    </>
  );
}

const AddTaskButton = () => {
  const [clicked, setClicked] = useState(false);
  const router = useRouter();
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
          onClick={() => console.log("Task-Gruppe hinzufügen")}>
          {"Task-Gruppe hinzufügen"}
        </Button>
        <br />
        <Button
          className='lowerButtonAdd'
          variant='primary'
          onClick={() => console.log("Task erstellen")}>
          {"Task erstellen"}
        </Button>
      </div>
    </>
  );
};

const TaskModal = () => {
  return <Modal></Modal>;
};

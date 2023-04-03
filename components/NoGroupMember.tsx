import { useRouter } from "next/router";
//Redux imports
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  doc,
  updateDoc,
  deleteField,
  FieldValue,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase-config";

const NoGroupMember = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const groupName = router.query.name;
  const groupInfo = user.groups.find((o) => o.name === groupName);

  if (groupInfo.myRole === "nothing") {
    console.log("Group will be delete from the array groups at firestore");
    const userRef = doc(db, "user", user.auth);
    //updates the doc, takes the groups array and removes the specific id from it
    updateDoc(userRef, {
      groups: arrayRemove(groupInfo.id),
    });

    return (
      <>
        <p>Du bist kein Mitglied der Gruppe {groupName}.</p>
        <p>
          Suche in Menü nach dieser Gruppe, um eine Beitrittsanfrage zu stellen.
        </p>
        <p>Die Gruppe wird vorerst aus deiner Liste gelöscht.</p>
      </>
    );
  }
  return (
    <>
      <p> {"This is the status of your join Request: " + groupInfo.myRole}</p>
    </>
  );
};

export default NoGroupMember;

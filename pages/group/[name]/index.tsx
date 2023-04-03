import { useState } from "react";
import { useRouter } from "next/router";
import Drawer from "../../../components/DrawerNavigation";
import Toolbar from "../../../components/Toolbar";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import NoGroupMember from "../../../components/NoGroupMember";
const Group = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const groupName = router.query.name;
  const [calledPush, setCalledPush] = useState(false);
  const groupInfo = user.groups.find((o) => o.name === groupName);
  //TODO: When entering a group page the system should check, if the user is already member of the group and if not handle this
  // if the request is still pending tell the user
  // if the request is declined then tell them am delete the group from the users list and also delete the request
  // if the user is member then just open the regular page

  // first the user has the id of the group in her list
  // with this the user can access this page here
  // then check the group information if the user is under members with any role
  // if yes enter the normal page
  // if not check if there is a joinrequests if not tell and add it or ask: do you want to send a joinRequest?

  if (groupInfo === undefined) {
    if (!calledPush) {
      router.push("/searchGroup");
      setCalledPush(true);
    }
    return <></>;
  }
  return (
    <>
      <Drawer />
      {groupInfo.myRole === "pending" || groupInfo.myRole === "nothing" ? (
        <NoGroupMember />
      ) : groupInfo.myRole === "owner" ? (
        <p>{"" + groupName} ist deine eigene Gruppe. Du bist der Ersteller</p>
      ) : groupInfo.myRole === "member" ? (
        <p>Group: {"" + groupName}</p>
      ) : (
        <></>
      )}

      <Toolbar />
    </>
  );
};

export default Group;

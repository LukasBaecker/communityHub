import { useRouter } from "next/router";
import Drawer from "../../../components/DrawerNavigation";
import Toolbar from "../../../components/Toolbar";
const Group = () => {
  const router = useRouter();
  const groupName = router.query.name;

  return (
    <>
      <Drawer></Drawer>
      <p>Group: {"" + groupName}</p>
      <Toolbar />
    </>
  );
};

export default Group;

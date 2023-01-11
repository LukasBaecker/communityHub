import { useRouter } from "next/router";
import Drawer from "../../../components/DrawerNavigation";
const Group = () => {
  const router = useRouter();
  const groupName = router.query.name;

  return (
    <>
      <Drawer></Drawer>
      <p>Group: {"" + groupName}</p>
    </>
  );
};

export default Group;

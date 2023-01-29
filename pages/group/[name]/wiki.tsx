import { useRouter } from "next/router";
import Drawer from "../../../components/DrawerNavigation";
import Toolbar from "../../../components/Toolbar";
const Wiki = () => {
  const router = useRouter();
  const groupName = router.query.name;

  return (
    <>
      <Drawer />
      <Toolbar />
      <p>This is the Wiki Page for {"" + groupName}</p>
    </>
  );
};

export default Wiki;

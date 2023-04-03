import { useRouter } from "next/router";
import Drawer from "../../components/DrawerNavigation";
import Toolbar from "../../components/Toolbar";
const Tasks = () => {
  const router = useRouter();
  const userId = router.query.id;

  return (
    <>
      <Drawer />
      <p>This page shows all the task an user has </p>
    </>
  );
};

export default Tasks;

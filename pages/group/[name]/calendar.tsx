import { useRouter } from "next/router";
import Drawer from "../../../components/DrawerNavigation";
const Calendar = () => {
  const router = useRouter();
  const groupName = router.query.name;

  return (
    <>
      <Drawer></Drawer>
      <p>This is the Calender Page for {"" + groupName}</p>
    </>
  );
};

export default Calendar;

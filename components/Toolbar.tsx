import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AiFillHome,
  AiOutlineCalendar,
  AiFillCalendar,
  AiFillCheckCircle,
  AiFillSetting,
  AiOutlineRead,
  AiFillRead,
} from "react-icons/ai";

export default function Toolbar() {
  const router = useRouter();
  const groupName = router.query.name;
  return (
    <Container className='toolbar'>
      <Row>
        <Col className='toolbarCol'>
          <Link className='toolbarLinks' href={"/group/" + groupName}>
            <AiFillHome className='toolbarIcon' />
          </Link>
        </Col>
        <Col className='toolbarCol'>
          <Link
            className='toolbarLinks'
            href={"/group/" + groupName + "/calendar"}>
            <AiFillCalendar className='toolbarIcon' />
          </Link>
        </Col>{" "}
        <Col className='toolbarCol'>
          <Link
            className='toolbarLinks'
            href={"/group/" + groupName + "/tasks"}>
            <AiFillCheckCircle className='toolbarIcon' />
          </Link>
        </Col>{" "}
        <Col className='toolbarCol'>
          <Link className='toolbarLinks' href={"/group/" + groupName + "/wiki"}>
            <AiFillRead className='toolbarIcon' />
          </Link>{" "}
        </Col>{" "}
        <Col className='toolbarCol'>
          <Link
            className='toolbarLinks'
            href={"/group/" + groupName + "/settings"}>
            <AiFillSetting className='toolbarIcon' />
          </Link>{" "}
        </Col>
      </Row>
    </Container>
  );
}

import { Container, Row, Col } from "react-bootstrap";

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
  return (
    <Container className='toolbar'>
      <Row>
        <Col className='toolbarCol'>
          <AiFillHome className='toolbarIcon' />
        </Col>
        <Col className='toolbarCol'>
          <AiFillCalendar className='toolbarIcon' />
        </Col>{" "}
        <Col className='toolbarCol'>
          <AiFillCheckCircle className='toolbarIcon' />
        </Col>{" "}
        <Col className='toolbarCol'>
          <AiFillRead className='toolbarIcon' />
        </Col>{" "}
        <Col className='toolbarCol'>
          <AiFillSetting className='toolbarIcon' />
        </Col>
      </Row>
    </Container>
  );
}

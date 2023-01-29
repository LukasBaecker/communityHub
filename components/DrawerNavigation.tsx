import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import Link from "next/link";
import { IconContext } from "react-icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useRouter } from "next/router";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { FaFeather } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { loading } from "../store/slices/statusSlice";
import { auth } from "../firebase/firebase-config";
import { unauthorize } from "../store/slices/authSlice";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillPlusCircle } from "react-icons/ai";
type groupeType = {
  name: string;
  description: string;
  roles: object;
};
function Drawer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sidebar, setSidebar] = useState(false);
  const [extended, setExtended] = useState(false);
  const extendSidebar = () => setExtended(!extended);
  const showSidebar = () => {
    setSidebar(!sidebar);
    setExtended(false);
  };
  const user = useAppSelector((state) => state.user);
  const userGroups = useAppSelector((state) => state.user.groups);

  const logout = async () => {
    router.push("/");
    dispatch(loading());
    signOut(auth).then((response) => {
      dispatch(unauthorize());
    });
  };

  return (
    <>
      <div className='navbar'>
        <FaBars className='menu-bars' onClick={showSidebar} />
      </div>
      <nav
        className={
          sidebar
            ? extended
              ? "nav-menu active extended"
              : "nav-menu active"
            : "nav-menu"
        }>
        <Container>
          <Row>
            <div className='navbar-toggle'>
              <AiOutlineClose className='menu-x' onClick={showSidebar} />
              <div onClick={extendSidebar} className='extend-arrow'>
                <IoIosArrowForward
                  className={extended ? "swapped" : "menu-arrow"}
                />
              </div>
            </div>
            <ul className='nav-menu-items' onClick={showSidebar}>
              <li key={"mainPage"} className={"mainPage"}>
                <Link className='garden-links' href={"/"}>
                  {/*<FaFeather />*/}
                  <span>{"ÜBERSICHT"}</span>
                </Link>
              </li>
              <hr className='rounded' />
              {userGroups.map((item: groupeType, index: number) => {
                return (
                  <li key={index} className={item.name}>
                    <Link className='garden-links' href={"/group/" + item.name}>
                      {/*<FaFeather />*/}
                      <span>{item.name.toUpperCase()}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Row>
          <Row className={extended ? "nav-bottom extended" : "nav-bottom"}>
            <Col className='addGroupButton' sm={12}>
              <Link className='garden-links' href={"/addGroup"}>
                <AiFillPlusCircle className='plusIcon' />
              </Link>
            </Col>
            <Col sm={12}>
              {" "}
              <Button variant='danger' onClick={() => logout()}>
                Logout
              </Button>
            </Col>
          </Row>
        </Container>
      </nav>
    </>
  );
}

export default Drawer;

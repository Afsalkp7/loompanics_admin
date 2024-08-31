import { FaUsers } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { PiPenNibStraightFill } from "react-icons/pi";
import { SiImessage } from "react-icons/si";
import { GiBuyCard } from "react-icons/gi";
import { IoLibrary } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";

// Correct use of JSX in a .jsx file
export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <IoHome />,
    cName: "nav-text",
  },
  {
    title: "Customers",
    path: "/users",
    icon: <FaUsers />,
    cName: "nav-text",
  },
  {
    title: "Books",
    path: "/products",
    icon: <ImBooks />,
    cName: "nav-text",
  },
  {
    title: "Authors",
    path: "/",
    icon: <PiPenNibStraightFill />,
    cName: "nav-text",
  },
  {
    title: "Messages",
    path: "/",
    icon: <SiImessage />,
    cName: "nav-text",
  },
  {
    title: "Borrowings",
    path: "/",
    icon: <GiBuyCard />,
    cName: "nav-text",
  },
  {
    title: "Library",
    path: "/",
    icon: <IoLibrary />,
    cName: "nav-text",
  },
  {
    title: "Profile",
    path: "/",
    icon: <IoMdSettings />,
    cName: "nav-text",
  },
  {
    title: "Messages",
    path: "/",
    icon: <SiImessage />,
    cName: "nav-text",
  },
  {
    title: "Borrowings",
    path: "/",
    icon: <GiBuyCard />,
    cName: "nav-text",
  },
  {
    title: "Library",
    path: "/",
    icon: <IoLibrary />,
    cName: "nav-text",
  },
  {
    title: "Profile",
    path: "/",
    icon: <IoMdSettings />,
    cName: "nav-text",
  },
  {
    title: "Logout",
    path: "/",
    icon: <CiLogout />,
    cName: "nav-text",
  },
];

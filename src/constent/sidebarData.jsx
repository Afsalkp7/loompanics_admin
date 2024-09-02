import { FaUsers } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { PiPenNibStraightFill } from "react-icons/pi";
import { SiImessage } from "react-icons/si";
import { GiBuyCard } from "react-icons/gi";
import { IoLibrary } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";
import { SiGradleplaypublisher } from "react-icons/si";


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
    path: "/authors",
    icon: <PiPenNibStraightFill />,
    cName: "nav-text",
  },
  {
    title: "Categories",
    path: "/categories",
    icon: <BiCategory />,
    cName: "nav-text",
  },
  {
    title: "Publishers",
    path: "/publishers",
    icon: <SiGradleplaypublisher />,
    cName: "nav-text",
  },
  {
    title: "Messages",
    path: "/messages",
    icon: <SiImessage />,
    cName: "nav-text",
  },
  {
    title: "Borrowings",
    path: "/borrowings",
    icon: <GiBuyCard />,
    cName: "nav-text",
  },
  {
    title: "Library",
    path: "/library",
    icon: <IoLibrary />,
    cName: "nav-text",
  },
  {
    title: "Profile",
    path: "/profile",
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

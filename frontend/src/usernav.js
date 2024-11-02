import { BsHeart } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { BsCart } from "react-icons/bs";

export const usernav = [
  {
    title: "Favourites",
    url: "/favourites",
    icon: <BsHeart />,
  },
  {
    title: "Cart",
    url: "/cart",
    icon: <BsCart />,
  },
  {
    title: "Login/Register",
    icon: <CiUser />,
    submenu: [
      {
        title: "Login",
        url: "/login",
      },
      {
        title: "Register",
        url: "/register",
      },
    ],
  },
];


import { Outlet } from "react-router-dom";
import { Navbar } from "@features/navbar";
import { Footer } from "@features/footer";
import { ScrollToTop } from "@shared";

const DefaultLayout = ({ navbarProps = {} }) => (
  <>
    <Navbar {...navbarProps} />
    <Outlet />
    <Footer />
    <ScrollToTop />
  </>
);

export default DefaultLayout;

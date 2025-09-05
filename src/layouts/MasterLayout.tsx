import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ScrollToTopButton from "../components/ScrollToTopBtn"

const MasterLayout = () => {
    return (
        <div className='main-layout h-100vh'>
            <Header />
            <Outlet />
            <Footer />
            <ScrollToTopButton />
        </div>
    )
}

export { MasterLayout }
import { Outlet } from "react-router-dom"
import Header from "../components/Header"

const MasterLayout = () => {
    return (
        <div className='main-layout h-100vh'>
            <Header />
            <Outlet />
        </div>
    )
}

export { MasterLayout }
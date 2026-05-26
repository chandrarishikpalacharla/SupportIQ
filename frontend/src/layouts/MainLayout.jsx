import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import "../styles/MainLayout.css"

const MainLayout = ({ children }) => (
  <div className="main-layout">
    <Sidebar />
    <div className="main-layout-body">
      <Navbar />
      <main className="main-layout-content">
        {children}
      </main>
    </div>
  </div>
)

export default MainLayout
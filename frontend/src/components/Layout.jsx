import { useNavigate } from 'react-router-dom'

function Layout({ children }) {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between">
        <h1 className="text-xl font-semibold">Warehouse App</h1>
        <button onClick={logout} className="text-sm underline">
          Wyloguj
        </button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}

export default Layout

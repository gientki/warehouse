import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [token, setToken] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    if (token.trim()) {
      localStorage.setItem('authToken', token)
      navigate('/products')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-xl mb-4 font-semibold">Zaloguj się</h1>
        <input
          type="text"
          placeholder="Wklej token..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Zaloguj
        </button>
      </div>
    </div>
  )
}

export default LoginPage


import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import Cart from './pages/Cart'
import MyOrders from './pages/MyOrders'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
      </main>
      <footer style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>&copy; 2026 Handbag Shop. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App

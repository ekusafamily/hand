import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useCart } from '../lib/CartContext'
import { Home, ClipboardList, User, ShoppingBag, LogOut } from 'lucide-react'

const ADMIN_EMAILS = ['kabilalavijanadeveloper@gmail.com', 'admin@handbagshop.com']

export default function Navbar() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    const { totalItems } = useCart()

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (!error) navigate('/')
    }

    // Get display name
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    const isAdmin = user && ADMIN_EMAILS.includes(user.email)

    return (
        <nav style={{
            height: 'var(--header-height)',
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1a1a1a', // Dark Background
            color: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} className="nav-logo">
                    <img src="/logo.png" alt="Sussie Collections" style={{ height: '75px', width: '75px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--color-accent)' }} />
                </Link>

                {/* Central Navigation with Universal Icons */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontWeight: '500' }}>

                    <Link to="/" style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.75rem', textDecoration: 'none' }}>
                        <Home size={22} color={location.pathname === '/' ? 'var(--color-accent)' : '#fff'} />
                        <span>Home</span>
                    </Link>

                    <Link to="/my-orders" style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.75rem', textDecoration: 'none' }}>
                        <ClipboardList size={22} color={location.pathname === '/my-orders' ? 'var(--color-accent)' : '#fff'} />
                        <span>Orders</span>
                    </Link>

                    {/* Check if user is logged in to decide destination/label */}
                    <Link to={user ? "/auth" : "/auth"} style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.75rem', textDecoration: 'none' }}>
                        <User size={22} color={location.pathname === '/auth' ? 'var(--color-accent)' : '#fff'} />
                        <span style={{ whiteSpace: 'nowrap' }}>{user ? 'Profile' : 'Account'}</span>
                    </Link>

                    {/* Shop Link - Hidden when ON the shop page */}
                    <Link
                        to="/shop"
                        className={location.pathname === '/shop' ? 'mobile-hidden' : ''}
                        style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.75rem', textDecoration: 'none' }}
                    >
                        <ShoppingBag size={22} color={location.pathname === '/shop' ? 'var(--color-accent)' : '#fff'} />
                        <span>Shop</span>
                    </Link>

                </div>


                {/* Right Side: Welcome / Logout / Admin */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Hide welcome text on mobile to save space */}
                            <div className="mobile-hidden" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.7rem', color: '#bbb', fontWeight: '600', textTransform: 'uppercase' }}>Welcome</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--color-accent)' }}>{displayName}</span>
                            </div>

                            {isAdmin && (
                                <Link to="/admin" className="btn" style={{
                                    padding: '6px 12px',
                                    fontSize: '0.75rem',
                                    background: 'var(--color-accent)',
                                    borderRadius: '8px',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    textDecoration: 'none'
                                }}>
                                    Dashboard
                                </Link>
                            )}

                            <button onClick={handleLogout} style={{
                                color: '#ff6b6b',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} title="Sign Out">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/auth" className="btn btn-primary mobile-hidden" style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--color-accent)', color: '#000', fontSize: '0.9rem', textDecoration: 'none' }}>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

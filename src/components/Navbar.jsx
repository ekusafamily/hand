import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useCart } from '../lib/CartContext'

const ADMIN_EMAILS = ['kabilalavijanadeveloper@gmail.com', 'admin@handbagshop.com'] // Add your admin email here

export default function Navbar() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
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
                    <img src="/logo.png" alt="Sussie Collections" style={{ height: '75px', width: '75px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--color-accent)' }} /> {/* Circular Logo */}
                </Link>

                <div style={{ display: 'flex', gap: '32px', alignItems: 'center', fontWeight: '500' }}>
                    <Link to="/" style={{ color: '#fff', transition: 'color 0.2s' }}>Home</Link>
                    <Link to="/shop" style={{ color: '#fff', transition: 'color 0.2s' }}>Shop</Link>
                    <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff' }}>
                        <span style={{ fontSize: '1.2rem' }}>🛒</span>
                        <span>Cart ({totalItems})</span>
                    </Link>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.8rem', color: '#bbb', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Welcome</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '500', textTransform: 'capitalize', color: 'var(--color-accent)' }}>{displayName}</span>
                            </div>
                            <div style={{ height: '32px', width: '1px', backgroundColor: '#444' }}></div>
                            <Link to="/my-orders" className="btn" style={{
                                padding: '8px 16px',
                                fontSize: '0.85rem',
                                background: '#333',
                                borderRadius: '12px',
                                color: '#fff',
                                border: '1px solid #555',
                                fontWeight: '600'
                            }}>
                                Orders
                            </Link>

                            {/* Only Show Dashboard to Admins */}
                            {isAdmin && (
                                <Link to="/admin" className="btn" style={{
                                    padding: '8px 16px',
                                    fontSize: '0.85rem',
                                    background: 'var(--color-accent)',
                                    borderRadius: '12px',
                                    color: '#000',
                                    fontWeight: 'bold'
                                }}>
                                    Dashboard
                                </Link>
                            )}
                            <button onClick={handleLogout} style={{
                                fontSize: '0.85rem',
                                color: '#ff6b6b',
                                fontWeight: '500',
                                padding: '8px',
                                borderRadius: '8px',
                                border: '1px solid transparent',
                                transition: 'all 0.2s'
                            }} className="btn-logout">
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link to="/auth" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '12px', background: 'var(--color-accent)', color: '#000' }}>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { useEffect, useState } from 'react';

export default function MobileCartBar() {
    const { cart } = useCart();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Hide on scroll down, show on scroll up (optional, currently strictly fixed as requested "non scrollable")
    // User asked for "non scrollable" which likely means "fixed position".

    if (totalItems === 0) return null;

    return (
        <>
            {/* Spacer to prevent content from being hidden behind the bar */}
            <div style={{ height: '70px', display: 'block', md: { display: 'none' } }} className="mobile-only-spacer"></div>

            <div className="mobile-cart-bar" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#1a1a1a',
                color: 'white',
                padding: '12px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1000,
                boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{totalItems} items</span>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Ksh {totalPrice.toLocaleString()}</span>
                </div>

                <Link to="/cart" style={{
                    backgroundColor: '#fff',
                    color: '#1a1a1a',
                    padding: '8px 24px',
                    borderRadius: '24px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    View Cart
                </Link>

                <style>{`
                    .mobile-cart-bar { display: flex; }
                    .mobile-only-spacer { display: block; }
                    @media (min-width: 640px) {
                        .mobile-cart-bar { display: none !important; }
                        .mobile-only-spacer { display: none !important; }
                    }
                `}</style>
            </div>
        </>
    );
}

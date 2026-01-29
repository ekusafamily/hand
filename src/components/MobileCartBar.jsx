import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function MobileCartBar() {
    const { cart } = useCart();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="mobile-cart-bar">
            <Link to="/cart" style={{
                position: 'fixed',
                bottom: '32px',
                right: '32px',
                backgroundColor: '#1a1a1a',
                color: 'white',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                zIndex: 9999,
                textDecoration: 'none',
                transition: 'transform 0.2s, background-color 0.2s',
                border: '2px solid #333'
            }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.backgroundColor = 'black'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
            >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={32} strokeWidth={2} />

                    {totalItems > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: '#ff4444',
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            minWidth: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #1a1a1a',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                            {totalItems}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
}

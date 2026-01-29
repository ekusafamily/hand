import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';

export default function MobileCartBar() {
    const { cart } = useCart();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="mobile-cart-bar">
            <Link to="/cart" style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: '#1a1a1a',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                zIndex: 9999,
                textDecoration: 'none',
                transition: 'transform 0.2s'
            }}>
                <div style={{ position: 'relative' }}>
                    <span style={{ fontSize: '1.5rem' }}>🛒</span>
                    {totalItems > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: '#ff4444',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            minWidth: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #1a1a1a'
                        }}>
                            {totalItems}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
}

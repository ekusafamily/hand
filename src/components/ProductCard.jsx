import { useToast } from '../lib/ToastContext'

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { addToast } = useToast();

    const handleAddToCart = () => {
        if (product.stock > 0) {
            addToCart(product);
            addToast(`Added ${product.title} to cart`);
        }
    };

    return (
        <div className="product-card" style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', transition: 'transform 0.2s', backgroundColor: '#fff' }}>
            {/* ... existing image logic ... */}
            <Link to={`/product/${product.id}`} style={{ display: 'block', height: '300px', overflow: 'hidden' }}>
                <img
                    src={product.image_url || 'https://via.placeholder.com/300'}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </Link>
            <div style={{ padding: '16px' }}>
                {/* ... existing title logic ... */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {product.title}
                    </Link>
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '12px', textTransform: 'capitalize' }}>{product.category}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Ksh {Number(product.price).toLocaleString()}</span>
                    <span style={{
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: product.stock > 0 ? '#00a500' : '#ff4444'
                    }}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </span>
                </div>
                <button
                    onClick={handleAddToCart}
                    className={`btn ${product.stock > 0 ? 'btn-outline' : 'btn-disabled'}`}
                    disabled={product.stock <= 0}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '0.85rem',
                        borderRadius: '12px',
                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                        opacity: product.stock > 0 ? 1 : 0.6
                    }}
                >
                    {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                </button>
            </div>
        </div>
    )
}

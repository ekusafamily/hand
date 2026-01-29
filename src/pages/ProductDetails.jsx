
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../lib/CartContext'

export default function ProductDetails() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCart()

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            setProduct(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="container" style={{ marginTop: '40px' }}>Loading...</div>

    if (!product) return (
        <div className="container" style={{ marginTop: '40px' }}>
            <h2>Product not found</h2>
            <Link to="/shop" className="btn btn-outline" style={{ marginTop: '20px' }}>Back to Shop</Link>
        </div>
    )

    return (
        <div className="container" style={{ marginTop: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
                <img
                    src={product.image_url}
                    alt={product.title}
                    style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow)' }}
                />
            </div>
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 style={{ marginBottom: '10px' }}>{product.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <p style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                        Ksh {Number(product.price).toLocaleString()}
                    </p>
                    <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        backgroundColor: product.stock > 0 ? '#e6f4ea' : '#fce8e6',
                        color: product.stock > 0 ? '#0d652d' : '#c5221f'
                    }}>
                        {product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}
                    </span>
                </div>
                <div style={{ marginBottom: '30px', color: '#666', lineHeight: '1.6' }}>
                    {product.description || 'No description available for this item.'}
                </div>

                <button
                    onClick={() => product.stock > 0 && addToCart(product)}
                    className={`btn ${product.stock > 0 ? 'btn-primary' : 'btn-disabled'}`}
                    disabled={product.stock <= 0}
                    style={{
                        padding: '16px 32px',
                        fontSize: '1.1rem',
                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                        opacity: product.stock > 0 ? 1 : 0.7
                    }}
                >
                    {product.stock > 0 ? 'Add to Cart' : 'Currently Unavailable'}
                </button>
                <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#999', textTransform: 'capitalize' }}>
                    Category: {product.category}
                </p>
            </div>
        </div>
    )
}

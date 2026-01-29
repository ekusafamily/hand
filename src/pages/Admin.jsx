import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Modal from '../components/Modal'

export default function Admin() {
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])

    // Form State
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('handbag')
    const [stock, setStock] = useState('10')
    const [imageFile, setImageFile] = useState(null)

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)

    useEffect(() => {
        fetchProducts()
        fetchOrders()
    }, [])

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error) setProducts(data || [])
    }

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error) setOrders(data || [])
    }

    const markAsDelivered = async (orderId) => {
        const { error } = await supabase
            .from('orders')
            .update({ delivery_status: 'delivered' })
            .eq('id', orderId)

        if (error) alert(error.message)
        else fetchOrders()
    }

    const handleUpload = async (e) => {
        e.preventDefault()

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return alert('You must be signed in to upload products!')

        if (!imageFile) return alert('Please select an image')

        setLoading(true)
        try {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, imageFile)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            const { error: insertError } = await supabase
                .from('products')
                .insert([{
                    title,
                    description,
                    price: parseFloat(price),
                    category,
                    image_url: publicUrl,
                    stock: parseInt(stock)
                }])

            if (insertError) throw insertError

            alert('Product added successfully!')
            setTitle('')
            setDescription('')
            setPrice('')
            setStock('10')
            setImageFile(null)
            fetchProducts()
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateStock = async (id, newStock) => {
        const { error } = await supabase
            .from('products')
            .update({ stock: Math.max(0, newStock) })
            .eq('id', id)

        if (error) alert(error.message)
        else fetchProducts()
    }

    const confirmDelete = (id) => {
        setProductToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteEffect = async () => {
        if (!productToDelete) return

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productToDelete)

        if (error) alert(error.message)
        else fetchProducts()

        setIsDeleteModalOpen(false)
        setProductToDelete(null)
    }

    const deleteProduct = async (id) => {
        // Fallback or deprecated if we use confirmDelete exclusively
        confirmDelete(id)
    }

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <Modal
                isOpen={isDeleteModalOpen}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                onConfirm={handleDeleteEffect}
                onCancel={() => setIsDeleteModalOpen(false)}
            />

            <h1 style={{ marginBottom: '30px' }}>Admin Dashboard</h1>

            {/* ORDERS SECTION (NEW) */}
            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Recent Orders</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                    {orders.map(order => (
                        <div key={order.id} style={{
                            padding: '24px',
                            background: '#fff',
                            border: '1px solid #eee',
                            borderRadius: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '20px',
                            borderLeft: order.payment_status === 'paid' ? '5px solid #00a500' : '5px solid #ffcc00'
                        }}>
                            <div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.1rem' }}>Order #{order.id.slice(0, 8)}</h3>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        background: order.payment_status === 'paid' ? '#e6f4ea' : '#fff8e1',
                                        color: order.payment_status === 'paid' ? '#0d652d' : '#f9a825',
                                        fontWeight: 'bold'
                                    }}>
                                        {order.payment_status.toUpperCase()}
                                    </span>
                                </div>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Phone:</strong> {order.phone_number}
                                </p>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Address:</strong> {order.delivery_address || 'N/A'}
                                </p>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Customer:</strong> {order.customer_name || 'Guest'}
                                </p>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                    <strong>Total:</strong> Ksh {order.total_amount}
                                </p>
                            </div>

                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {order.delivery_status === 'delivered' ? (
                                    <span style={{ color: '#00a500', fontWeight: 'bold' }}>✅ Delivered</span>
                                ) : (
                                    <button
                                        onClick={() => markAsDelivered(order.id)}
                                        className="btn btn-outline"
                                        disabled={order.payment_status !== 'paid'}
                                        style={{ opacity: order.payment_status !== 'paid' ? 0.5 : 1 }}
                                    >
                                        Mark as Delivered
                                    </button>
                                )}
                                <span style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(order.created_at).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && <p style={{ color: '#999' }}>No orders yet.</p>}
                </div>
            </section>

            <div style={{ height: '1px', background: '#eee', margin: '40px 0' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '60px', marginTop: '40px' }}>

                {/* Left: Upload Form */}
                <section>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Add New Product</h2>

                    <form onSubmit={handleUpload} style={{ background: '#fafafa', padding: '30px', borderRadius: '24px', border: '1px solid #eee' }}>
                        <div>
                            <label>Product Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label>Category</label>
                                <select value={category} onChange={e => setCategory(e.target.value)}>
                                    <option value="handbag">Handbag</option>
                                    <option value="household">Household Item</option>
                                </select>
                            </div>
                            <div>
                                <label>Price (KES)</label>
                                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                            </div>
                        </div>

                        <div>
                            <label>Initial Stock Count</label>
                            <input type="number" value={stock} onChange={e => setStock(e.target.value)} required />
                        </div>

                        <div>
                            <label>Description</label>
                            <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Product Image</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <label htmlFor="file-upload" className="btn" style={{
                                    background: 'var(--color-accent)',
                                    color: '#000',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: '1px solid #d4a972',
                                    display: 'inline-block'
                                }}>
                                    Choose Image
                                </label>
                                <span style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                                    {imageFile ? imageFile.name : 'No file chosen'}
                                </span>
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={e => setImageFile(e.target.files[0])}
                                style={{ display: 'none' }}
                                required={!imageFile} // Required only if no file selected yet
                            />
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                            {loading ? 'Uploading...' : 'Add Product'}
                        </button>
                    </form>
                </section>

                {/* Right: Management List */}
                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Inventory Management</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {products.map(product => (
                            <div key={product.id} style={{
                                display: 'flex',
                                gap: '16px',
                                padding: '16px',
                                background: '#fff',
                                border: '1px solid #eee',
                                borderRadius: '16px',
                                alignItems: 'center'
                            }}>
                                <img src={product.image_url} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{product.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Ksh {product.price}</p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', padding: '4px 12px', borderRadius: '12px' }}>
                                    <button onClick={() => updateStock(product.id, product.stock - 1)} style={{ fontWeight: 'bold' }}>-</button>
                                    <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{product.stock}</span>
                                    <button onClick={() => updateStock(product.id, product.stock + 1)} style={{ fontWeight: 'bold' }}>+</button>
                                </div>

                                <button
                                    onClick={() => confirmDelete(product.id)}
                                    style={{ color: '#ff4444', padding: '8px', fontSize: '1.2rem' }}
                                    title="Delete Product"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No products found in inventory.</p>
                        )}
                    </div>
                </section>

            </div>
        </div>
    )
}

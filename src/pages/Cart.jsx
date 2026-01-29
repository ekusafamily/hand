import { useState, useEffect } from 'react'
import { useCart } from '../lib/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { initiateSTKPush } from '../lib/payments'
import { supabase } from '../lib/supabase'

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
    const navigate = useNavigate()

    // Payment State
    const [customerName, setCustomerName] = useState('')
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [paymentStatus, setPaymentStatus] = useState('idle')
    const [statusMessage, setStatusMessage] = useState('')
    const [currentOrderId, setCurrentOrderId] = useState(null)

    // Polling Effect
    useEffect(() => {
        let interval;
        if (paymentStatus === 'polling' && currentOrderId) {
            interval = setInterval(async () => {
                const { data: order } = await supabase
                    .from('orders')
                    .select('payment_status')
                    .eq('id', currentOrderId)
                    .single()

                if (order && order.payment_status === 'paid') {
                    setPaymentStatus('success')
                    setStatusMessage('Payment Confirmed! Redirecting...')
                    clearInterval(interval)
                    setTimeout(() => {
                        clearCart()
                        navigate('/my-orders')
                    }, 2000)
                }
            }, 3000)
        }
        return () => clearInterval(interval)
    }, [paymentStatus, currentOrderId, clearCart, navigate])

    const handlePayment = async () => {
        if (!customerName) return setStatusMessage('Please enter your full name.')
        if (!address) return setStatusMessage('Please enter your delivery address.')
        if (!phoneNumber) return setStatusMessage('Please enter a M-Pesa phone number.')

        setPaymentStatus('loading')
        setStatusMessage('Creating order...')

        try {
            // Get Current User
            const { data: { session } } = await supabase.auth.getSession()
            const userId = session?.user?.id || null

            // 1. Create Order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    customer_name: customerName,
                    phone_number: phoneNumber,
                    delivery_address: address, // New Field
                    total_amount: totalPrice,
                    items: cart,
                    payment_status: 'pending',
                    user_id: userId
                }])
                .select()
                .single()

            if (orderError) throw new Error('Failed to create order: ' + orderError.message)

            setCurrentOrderId(orderData.id)
            setStatusMessage('Initiating M-Pesa payment...')

            // 2. Initiate Payment
            const result = await initiateSTKPush(phoneNumber, totalPrice, orderData.id)

            if (result.success) {
                setPaymentStatus('polling')
                setStatusMessage('Payment Initiated! Please check your phone.')
            } else {
                setPaymentStatus('error')
                setStatusMessage(result.message)
            }
        } catch (error) {
            console.error('Payment Error:', error)
            setPaymentStatus('error')
            setStatusMessage(error.message || 'An unexpected error occurred.')
        }
    }

    if (cart.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '100px', minHeight: '60vh' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
                <h1 style={{ marginBottom: '20px' }}>Your Cart is Empty</h1>
                <p style={{ color: '#666', marginBottom: '30px' }}>Start shopping for beautiful handbags.</p>
                <Link to="/shop" className="btn btn-primary" style={{ padding: '12px 32px' }}>
                    Shop Collection
                </Link>
            </div>
        )
    }

    return (
        <div className="container" style={{ marginTop: '40px' }}>
            <h1 style={{ marginBottom: '40px' }}>Shopping Cart</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                {/* List Items (Unchanged) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {cart.map((item) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            gap: '20px',
                            padding: '20px',
                            border: '1px solid #eee',
                            borderRadius: '16px',
                            backgroundColor: '#fff',
                            flexWrap: 'wrap'
                        }}>
                            <img
                                src={item.image_url}
                                alt={item.title}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.1rem' }}>{item.title}</h3>
                                    <button onClick={() => removeFromCart(item.id)} style={{ color: '#ff4444', fontSize: '0.85rem' }}>Remove</button>
                                </div>
                                <p style={{ color: '#666', marginBottom: '16px', fontSize: '0.9rem' }}>Ksh {Number(item.price).toLocaleString()}</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <button onClick={() => updateQuantity(item.id, -1)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #eee' }}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #eee' }}>+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary & Checkout */}
                <div style={{
                    padding: '30px',
                    backgroundColor: '#fafafa',
                    borderRadius: '24px',
                    height: 'fit-content',
                    position: 'sticky',
                    top: '120px'
                }}>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '24px' }}>Checkout Details</h2>

                    {/* New Form Fields */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Delivery Address / Location</label>
                        <textarea
                            rows="2"
                            placeholder="e.g. Ruaka, Joyland Apartments, House 4B"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>M-Pesa Phone Number</label>
                        <input
                            type="text"
                            placeholder="e.g. 0712345678"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold' }}>
                        <span>Total to Pay</span>
                        <span>Ksh {totalPrice.toLocaleString()}</span>
                    </div>

                    {paymentStatus !== 'idle' && (
                        <div style={{
                            padding: '12px',
                            borderRadius: '12px',
                            marginBottom: '16px',
                            backgroundColor: paymentStatus === 'success' ? '#e6f4ea' : paymentStatus === 'error' ? '#fce8e6' : '#e3f2fd',
                            color: paymentStatus === 'success' ? '#0d652d' : paymentStatus === 'error' ? '#c5221f' : '#0d47a1',
                            fontSize: '0.9rem'
                        }}>
                            {statusMessage}
                            {paymentStatus === 'polling' && <span style={{ display: 'block', fontSize: '0.8rem', marginTop: '4px' }}>Waiting for confirmation...</span>}
                        </div>
                    )}

                    <button
                        onClick={handlePayment}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '16px' }}
                        disabled={paymentStatus === 'loading' || paymentStatus === 'polling' || totalPrice === 0}
                    >
                        {paymentStatus === 'loading' ? 'Processing...' : 'Pay with M-Pesa'}
                    </button>

                    <p style={{ marginTop: '16px', fontSize: '0.8rem', color: '#999', textAlign: 'center' }}>
                        Payments secured by Lipia Online
                    </p>
                </div>
            </div>
        </div>
    )
}

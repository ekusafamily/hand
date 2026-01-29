import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function MyOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })

            if (!error) setOrders(data)
            setLoading(false)
        }

        fetchOrders()

        // Real-time subscription for Order Updates
        const subscription = supabase
            .channel('orders')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    setOrders((prev) => prev.map((order) =>
                        order.id === payload.new.id ? payload.new : order
                    ))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    if (loading) return <div className="container" style={{ padding: '40px' }}>Loading...</div>

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ marginBottom: '30px' }}>My Orders</h1>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#fafafa', borderRadius: '16px' }}>
                    <p style={{ color: '#666', marginBottom: '20px' }}>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{
                            padding: '24px',
                            background: '#fff',
                            border: '1px solid #eee',
                            borderRadius: '16px',
                            borderLeft: order.payment_status === 'paid' ? '5px solid #00a500' : '5px solid #ffcc00'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
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
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                        {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                                    </p>
                                    <p style={{ marginTop: '8px', fontWeight: 'bold' }}>Ksh {order.total_amount}</p>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    {order.delivery_status === 'delivered' ? (
                                        <div style={{ color: '#00a500', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                            <span style={{ fontSize: '1.5rem' }}>🎁</span>
                                            <strong>Delivered</strong>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#f9a825', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                            <span style={{ fontSize: '1.5rem' }}>🚚</span>
                                            <span>Processing / On the way</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

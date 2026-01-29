
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

export default function Shop() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [sortOrder, setSortOrder] = useState('default')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            let query = supabase.from('products').select('*')
            const { data, error } = await query
            if (error) throw error
            setProducts(data || [])
        } catch (error) {
            console.error('Error fetching products:', error.message)
        } finally {
            setLoading(false)
        }
    }

    // Processing: Filter -> Sort
    const processedProducts = [...products]
        .filter(p => categoryFilter === 'all' ? true : p.category === categoryFilter)
        .sort((a, b) => {
            if (sortOrder === 'price-low') return a.price - b.price;
            if (sortOrder === 'price-high') return b.price - a.price;
            return 0; // Default (id or insertion order)
        });

    // Grouping logic for "All" view
    const sections = categoryFilter === 'all'
        ? ['handbag', 'household'].filter(cat => processedProducts.some(p => p.category === cat))
        : [categoryFilter];

    return (
        <div className="shop-page">
            <div className="container">
                {/* Shop Header */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    marginBottom: '60px',
                    padding: '40px',
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    border: '1px solid #f0f0f0'
                }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Our Collection</h1>
                        <p style={{ color: '#666' }}>Explore our premium range of handbags and home curated essentials.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.9rem', color: '#999', fontWeight: '600' }}>FILTER:</span>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{ width: 'auto', marginBottom: 0, padding: '10px 20px', borderRadius: '12px' }}
                            >
                                <option value="all">All Items</option>
                                <option value="handbag">Handbags Only</option>
                                <option value="household">Household Only</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.9rem', color: '#999', fontWeight: '600' }}>SORT BY:</span>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                style={{ width: 'auto', marginBottom: 0, padding: '10px 20px', borderRadius: '12px' }}
                            >
                                <option value="default">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>
                        <p>Loading our beautiful collection...</p>
                    </div>
                ) : processedProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', backgroundColor: '#fafafa', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No products found</h3>
                        <p style={{ color: '#666' }}>We're currently updating our stock. Please check back soon!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                        {sections.map(category => {
                            const categoryProducts = processedProducts.filter(p => p.category === category);
                            if (categoryProducts.length === 0) return null;

                            return (
                                <section key={category} className="shop-section">
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'baseline',
                                        marginBottom: '32px',
                                        borderBottom: '2px solid #f3f0eb',
                                        paddingBottom: '16px'
                                    }}>
                                        <h2 style={{ fontSize: '1.8rem', textTransform: 'capitalize' }}>
                                            {category === 'handbag' ? 'Handbag Collection' : 'Home Essentials'}
                                        </h2>
                                        <span style={{ color: '#999', fontWeight: '500' }}>{categoryProducts.length} Items</span>
                                    </div>
                                    <div className="grid-products">
                                        {categoryProducts.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

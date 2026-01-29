
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero" style={{
                backgroundColor: '#fdfbf7',
                padding: '100px 20px',
                textAlign: 'center',
                backgroundImage: 'linear-gradient(to bottom, #f3f0eb, #fdfbf7)',
                borderRadius: '0 0 40px 40px',
                marginBottom: '60px'
            }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        backgroundColor: '#efebe3',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#a88b6e',
                        marginBottom: '24px'
                    }}>
                        Timeless Elegance for Your Lifestyle
                    </span>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '24px', color: '#1a1a1a', fontWeight: '800', lineHeight: '1.1' }}>
                        Sussie's <br /> Collection
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '40px', lineHeight: '1.6' }}>
                        Curated handbags and household essentials delivered right to your doorstep.
                        Experience quality like never before.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <Link to="/shop" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                            Shop Now
                        </Link>
                        <Link to="/auth" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                            Create account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Our Promise Section: We Pay, We Deliver */}
            <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '48px', color: '#1a1a1a' }}>Our Service Philosophy</h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '40px',
                            width: '100%'
                        }}>
                            <div style={{
                                padding: '40px',
                                border: '1px solid #eee',
                                borderRadius: '24px',
                                background: '#fafafa',
                                transition: 'transform 0.3s ease'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💳</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>We Pay</h3>
                                <p style={{ color: '#666', lineHeight: '1.6' }}>
                                    We handle all the upstream logistics and manufacturing costs.
                                    Our commitment starts with investing in quality products before they even reach you.
                                </p>
                            </div>

                            <div style={{
                                padding: '40px',
                                border: '1px solid #eee',
                                borderRadius: '24px',
                                background: '#fafafa',
                                transition: 'transform 0.3s ease'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚚</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>We Deliver</h3>
                                <p style={{ color: '#666', lineHeight: '1.6' }}>
                                    Our nationwide delivery network ensures that your favorite items arrive
                                    safely and promptly at your door, anywhere in the country.
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '60px', padding: '24px 40px', backgroundColor: '#f3f0eb', borderRadius: '16px' }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: '500', color: '#333' }}>
                                <strong>"You Pay, We Deliver"</strong> — It's more than a slogan, it's our guarantee of trust and efficiency.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '80px 0', backgroundColor: '#f9f9f9', borderRadius: '40px' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#a88b6e', fontSize: '2rem', marginBottom: '16px' }}>⭐</div>
                            <h4 style={{ marginBottom: '8px' }}>Premium Quality</h4>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Hand-picked materials for every product.</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#a88b6e', fontSize: '2rem', marginBottom: '16px' }}>🏠</div>
                            <h4 style={{ marginBottom: '8px' }}>Home Curated</h4>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Essentials that fit your home perfectly.</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#a88b6e', fontSize: '2rem', marginBottom: '16px' }}>🛡️</div>
                            <h4 style={{ marginBottom: '8px' }}>Secure Payment</h4>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Your transactions are always safe.</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#a88b6e', fontSize: '2rem', marginBottom: '16px' }}>💬</div>
                            <h4 style={{ marginBottom: '8px' }}>24/7 Support</h4>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>We are always here to help you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section style={{ padding: '100px 0' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '60px', fontSize: '2.5rem' }}>Browse Collections</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                        {/* Handbags */}
                        <div style={{
                            height: '450px',
                            background: '#eee',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800"
                                alt="Handbags"
                                style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
                            }}></div>
                            <Link to="/shop" style={{
                                position: 'relative',
                                background: 'white',
                                padding: '16px 40px',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                zIndex: 1,
                                marginBottom: '40px',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                            }}>
                                Shop Handbags
                            </Link>
                        </div>

                        {/* Household */}
                        <div style={{
                            height: '450px',
                            background: '#eee',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800"
                                alt="Household"
                                style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
                            }}></div>
                            <Link to="/shop" style={{
                                position: 'relative',
                                background: 'white',
                                padding: '16px 40px',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                zIndex: 1,
                                marginBottom: '40px',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                            }}>
                                Home Essentials
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}



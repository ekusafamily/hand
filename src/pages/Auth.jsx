
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const navigate = useNavigate()

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error

                // If session is created, email confirmation is disabled -> Logged in
                if (data.session) {
                    alert('Registration successful! You are now logged in.')
                    navigate('/')
                } else {
                    alert('Check your email for the login link!')
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                navigate('/')
            }
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto' }}>
            <h1>{isSignUp ? 'Create Account' : 'Sign In'}</h1>
            <form onSubmit={handleAuth} style={{ marginTop: '20px' }}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                </button>
            </form>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                >
                    {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
            </div>
        </div>
    )
}

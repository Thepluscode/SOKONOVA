import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../contexts/ToastContext';

export default function OAuthCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setAuthData } = useAuth();
    const { showToast } = useToast();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (token && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));

                // Store auth data
                setAuthData({ user, token });

                setStatus('success');
                showToast({
                    message: `Welcome${user.name ? `, ${user.name}` : ''}! You've signed in successfully.`,
                    type: 'success'
                });

                // Redirect based on role
                setTimeout(() => {
                    if (user.role === 'ADMIN') {
                        navigate('/admin/control-tower');
                    } else if (user.role === 'SELLER') {
                        navigate('/seller-dashboard');
                    } else {
                        navigate('/account');
                    }
                }, 1500);
            } catch {
                setStatus('error');
                showToast({
                    message: 'Failed to process login. Please try again.',
                    type: 'error'
                });
                setTimeout(() => navigate('/login'), 2000);
            }
        } else {
            setStatus('error');
            showToast({
                message: 'Login failed. Missing authentication data.',
                type: 'error'
            });
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [searchParams, setAuthData, navigate, showToast]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
                {status === 'loading' && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                            <i className="ri-loader-4-line text-3xl text-emerald-600 animate-spin"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Signing you in...</h1>
                        <p className="text-gray-600">Please wait while we complete your login.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                            <i className="ri-check-line text-3xl text-emerald-600"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h1>
                        <p className="text-gray-600">Redirecting you to your account...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <i className="ri-error-warning-line text-3xl text-red-600"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Failed</h1>
                        <p className="text-gray-600">Redirecting you back to login...</p>
                    </>
                )}
            </div>
        </div>
    );
}

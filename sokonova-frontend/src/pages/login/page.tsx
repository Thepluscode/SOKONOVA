import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Input from '../../components/base/Input';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../lib/auth';
import { getErrorMessage } from '../../lib/errorUtils';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showToast({
        message: 'Please enter both email and password.',
        type: 'warning'
      });
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);

      showToast({
        message: 'Signed in successfully. Redirecting...',
        type: 'success'
      });

      // Role-based redirect
      setTimeout(() => {
        if (user?.role === 'ADMIN') {
          navigate('/admin/control-tower');
        } else if (user?.role === 'SELLER') {
          navigate('/seller-dashboard');
        } else {
          navigate('/account');
        }
      }, 1000);
    } catch (error: unknown) {
      console.error('Login error:', error);
      const message = getErrorMessage(error, 'login');
      showToast({
        message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <i className="ri-user-line text-3xl text-emerald-600"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your SOKONOVA account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-semibold whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <i className="ri-login-box-line mr-2"></i>
                  Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="ri-google-fill text-xl mr-2 text-red-500"></i>
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="ri-facebook-fill text-xl mr-2 text-blue-600"></i>
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                Sign up now
              </Link>
            </p>
          </div>

          {/* Seller Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Want to sell on SOKONOVA?{' '}
              <Link
                to="/sell"
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                Become a seller
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <i className="ri-shield-check-line text-emerald-600 mr-1"></i>
              <span>Secure Login</span>
            </div>
            <div className="flex items-center">
              <i className="ri-lock-line text-emerald-600 mr-1"></i>
              <span>Encrypted</span>
            </div>
            <div className="flex items-center">
              <i className="ri-customer-service-2-line text-emerald-600 mr-1"></i>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

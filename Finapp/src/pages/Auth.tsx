import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Leaf, Mail, Lock, User, Palette } from 'lucide-react';
import clsx from 'clsx';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [theme, setTheme] = useState<'green' | 'pink'>('green');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        // Sign In
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        // Sign Up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              theme: theme, 
            }
          }
        });
        if (signUpError) throw signUpError;
        
        if (data.user && data.session === null) {
          setSuccessMsg('¡Cuenta creada! Por favor revisa tu correo electrónico para confirmarla.');
        } else {
          setSuccessMsg('¡Cuenta creada exitosamente!');
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al autenticar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-brand-dark p-8 text-center text-white">
          <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Bienvenido a FinApp</h1>
          <p className="text-brand-light/80">Tu vida financiera, bajo control.</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="mb-4 p-3 bg-brand-light border border-brand/20 text-brand-dark rounded-lg text-sm text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                      placeholder="Ej. Sanders Leiva"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color de Tema</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme('green')}
                      className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors flex items-center justify-center gap-2",
                        theme === 'green' ? "border-brand bg-brand-light text-brand-dark" : "border-gray-100 bg-gray-50 text-gray-500"
                      )}
                    >
                      <Palette className="w-4 h-4" />
                      Verde
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('pink')}
                      className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors flex items-center justify-center gap-2",
                        theme === 'pink' ? "border-pink-500 bg-pink-50 text-pink-700" : "border-gray-100 bg-gray-50 text-gray-500"
                      )}
                    >
                      <Palette className="w-4 h-4" />
                      Rosa
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-bold transition-colors disabled:opacity-50 mt-6"
            >
              {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-brand font-bold hover:underline"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

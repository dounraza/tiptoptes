import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, ShieldCheck } from 'lucide-react';
import { authApi } from '../lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.login({ email, password });
      navigate('/admin');
    } catch (err) {
      setError('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00ffff]/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#7000ff]/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#050505] border border-[#00ffff]/20 rounded-3xl mb-6 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
            <ShieldCheck size={40} className="text-[#00ffff]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase mb-2 italic">IZY-FAST</h1>
          <p className="text-[#00ffff] font-bold text-[10px] tracking-[0.4em] uppercase">Admin Portal Access</p>
        </div>

        <div className="bg-[#050505] p-10 rounded-[2.5rem] border border-[#00ffff]/10 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff]/60 mb-3 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00ffff] transition-colors" size={18} />
                <input 
                  type="email" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-black border border-[#00ffff]/5 rounded-2xl focus:border-[#00ffff]/50 text-white outline-none transition-all font-bold tracking-widest text-sm"
                  placeholder="admin@izyfast.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#00ffff]/60 mb-3 ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00ffff] transition-colors" size={18} />
                <input 
                  type="password" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-black border border-[#00ffff]/5 rounded-2xl focus:border-[#00ffff]/50 text-white outline-none transition-all font-bold tracking-widest text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-[#7000ff] hover:bg-[#8521ff] text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_30px_rgba(112,0,255,0.3)] active:scale-95 flex items-center justify-center gap-3 text-xs disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    Initialize Session
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center mt-8 text-gray-600 font-bold text-[10px] tracking-[0.2em] uppercase">
          &copy; 2024 IZY-FAST TOP UP . Secured Infrastructure
        </p>
      </div>
    </div>
  );
};

export default Login;

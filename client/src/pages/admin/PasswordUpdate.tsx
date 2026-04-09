import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { authApi } from '../../lib/api';

const PasswordUpdate = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // useEffect to check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page if no token is found
      navigate('/login');
    }
  }, [navigate]); // Add navigate to dependency array

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setLoading(true);
    try {
      await authApi.updatePassword(newPassword);
      setMessage('Mot de passe mis à jour avec succès');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      // Handle cases where the token might have expired on the server
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login'); // Redirect to login
      } else {
        setMessage(error.response?.data?.error || 'Erreur lors de la mise à jour');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#00ffff] mb-6">Mettre à jour le mot de passe</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 bg-[#050505] border border-[#00ffff]/20 rounded-lg text-white focus:outline-none focus:border-[#00ffff]"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 bg-[#050505] border border-[#00ffff]/20 rounded-lg text-white focus:outline-none focus:border-[#00ffff]"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00ffff] text-black font-bold py-2 px-4 rounded-lg hover:bg-[#00ffff]/80 disabled:opacity-50"
        >
          {loading ? 'Mise à jour...' : 'Mettre à jour'}
        </button>
        
        {message && (
          <p className={`text-sm ${message.includes('succès') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default PasswordUpdate;
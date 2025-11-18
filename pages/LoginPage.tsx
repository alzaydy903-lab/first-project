
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, t } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl shadow-cyan-500/10">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 text-white">{t('adminLogin')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-lg sm:text-xl font-bold mb-3">
              {t('password')}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="text-lg sm:text-xl appearance-none border-2 border-slate-700 rounded-lg w-full py-3 px-4 bg-slate-800/50 text-white leading-tight focus:outline-none focus:bg-slate-700 focus:border-cyan-500 transition-colors"
              aria-required="true"
              aria-invalid={!!error}
              aria-describedby={error ? "password-error" : undefined}
            />
          </div>
          {error && <p id="password-error" className="text-red-400 text-base sm:text-lg text-center mb-4">{error}</p>}
          <div className="flex items-center justify-center mt-8">
            <button
              type="submit"
              className="text-xl sm:text-2xl shadow w-full bg-cyan-600 hover:bg-cyan-500 focus:shadow-outline focus:outline-none text-slate-900 font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {t('login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
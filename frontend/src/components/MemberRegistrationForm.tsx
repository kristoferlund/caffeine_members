import React, { useState } from 'react';
import { useAddMember } from '../hooks/useQueries';
import type { AddMemberResult } from '../backend';

interface MemberRegistrationFormProps {
  onSuccess: (message: string, type: 'success') => void;
  onError: (message: string, type: 'error') => void;
  secretMode?: boolean;
}

export default function MemberRegistrationForm({ onSuccess, onError, secretMode }: MemberRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: ''
  });

  const addMemberMutation = useAddMember();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.surname.trim() || !formData.email.trim()) {
      onError('All fields are required', 'error');
      return;
    }

    try {
      const result: AddMemberResult = await addMemberMutation.mutateAsync({
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        email: formData.email.trim()
      });

      if ('ok' in result) {
        onSuccess(`Member registered successfully!${secretMode ? ' 🎮' : ''}`, 'success');
        setFormData({ name: '', surname: '', email: '' });
      } else {
        // Handle specific error messages from backend
        onError(result.err, 'error');
      }
    } catch {
      onError('Failed to register member. Please try again.', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-xs font-bold text-black mb-1 font-mono">
          First Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono focus:outline-none focus:border-win95-blue"
          placeholder="Enter first name"
          disabled={addMemberMutation.isPending}
        />
      </div>

      <div>
        <label htmlFor="surname" className="block text-xs font-bold text-black mb-1 font-mono">
          Last Name:
        </label>
        <input
          type="text"
          id="surname"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono focus:outline-none focus:border-win95-blue"
          placeholder="Enter last name"
          disabled={addMemberMutation.isPending}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-bold text-black mb-1 font-mono">
          Email Address:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-2 py-1 border-win95-sunken bg-white text-black text-sm font-mono focus:outline-none focus:border-win95-blue"
          placeholder="Enter email address"
          disabled={addMemberMutation.isPending}
        />
      </div>

      <button
        type="submit"
        disabled={addMemberMutation.isPending}
        className={`w-full win95-button text-black py-2 px-4 text-sm font-bold font-mono border-win95-raised hover:bg-win95-highlight active:border-win95-sunken disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
          secretMode ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-win95-gray'
        }`}
      >
        {addMemberMutation.isPending ? (
          <>
            <span className="win95-loading-dots mr-2">
              <span>●</span><span>●</span><span>●</span>
            </span>
            Registering...
          </>
        ) : (
          `✅ Register Member${secretMode ? ' 🎮' : ''}`
        )}
      </button>
    </form>
  );
}

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { User as UserIcon, Mail, Phone, Shield, Bell, Globe, Moon, Loader2, CheckCircle2, Crown } from 'lucide-react';

export default function Settings() {
  const { profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [language, setLanguage] = useState('en');

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from('profiles')
      .update({ full_name: fullName, phone })
      .eq('id', profile?.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!profile) return null;
  const isAdmin = profile.role === 'admin';

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Profile Information</h3>
          <p className="text-sm text-slate-500 mt-0.5">Update your personal details</p>
        </div>
        <div className="p-6 space-y-5">
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white ${
              isAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            }`}>
              {fullName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-medium text-slate-800">{fullName || 'Your Name'}</p>
              <p className="text-sm text-slate-500">{profile.email}</p>
              <span className={`inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                isAdmin ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
              }`}>
                {isAdmin ? <Crown className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                {isAdmin ? 'Administrator' : 'Standard User'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 890"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email (read-only)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save Changes
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Saved successfully
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Preferences</h3>
          <p className="text-sm text-slate-500 mt-0.5">Customize your experience</p>
        </div>
        <div className="p-6 space-y-5">
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Push Notifications</p>
                <p className="text-xs text-slate-500">Get notified about new activity</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-blue-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* SMS Alerts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">SMS Alerts</p>
                <p className="text-xs text-slate-500">Receive SMS for important operations</p>
              </div>
            </div>
            <button
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`relative w-12 h-6 rounded-full transition-colors ${smsAlerts ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${smsAlerts ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <Globe className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Language</p>
                <p className="text-xs text-slate-500">Select your preferred language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Security</h3>
          <p className="text-sm text-slate-500 mt-0.5">Account security information</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">Account Protected</p>
              <p className="text-xs text-slate-500">Your account is secured with Supabase Auth</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">Active</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 text-center">
            Account created on {new Date(profile.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

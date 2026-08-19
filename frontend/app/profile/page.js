'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { apiGet, apiPatch } from '@/lib/api';

const STORAGE_PREFIX = 'profile-studio';

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getWorkspaceKey(user) {
  return `${STORAGE_PREFIX}:${user?._id || user?.id || user?.email || 'guest'}`;
}

function createDefaultWorkspace(user) {
  const name = user?.fullName || user?.full_name || 'Founder';

  return {
    headline: 'Building bold ideas with clarity, momentum, and strong execution.',
    bio: `${name} is focused on turning learning into visible progress through structured action, startup thinking, and disciplined execution.`,
    phone: '',
    location: 'Hyderabad, India',
    timezone: 'IST (UTC+5:30)',
    website: '',
    linkedin: '',
    focusWord: 'Momentum',
    energy: 'Focused',
    ambition: 'Scale',
    availability: 'Open to collaborations',
    goals: [
      { id: makeId('goal'), title: 'Complete my current course roadmap', done: false },
      { id: makeId('goal'), title: 'Ship one meaningful milestone this week', done: true },
    ],
    wins: [
      { id: makeId('win'), title: 'Joined the platform and started building my profile', date: new Date().toISOString() },
    ],
    links: [],
  };
}

function loadWorkspace(user) {
  if (typeof window === 'undefined') return createDefaultWorkspace(user);

  const defaults = createDefaultWorkspace(user);

  try {
    const raw = localStorage.getItem(getWorkspaceKey(user));
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      goals: Array.isArray(parsed?.goals) ? parsed.goals : defaults.goals,
      wins: Array.isArray(parsed?.wins) ? parsed.wins : defaults.wins,
      links: Array.isArray(parsed?.links) ? parsed.links : defaults.links,
    };
  } catch {
    return defaults;
  }
}

function saveWorkspace(user, workspace) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getWorkspaceKey(user), JSON.stringify(workspace));
}

function calculateCompletion(user, workspace) {
  const checks = [
    Boolean(user?.fullName || user?.full_name),
    Boolean(user?.email),
    Boolean(workspace?.headline),
    Boolean(workspace?.bio),
    Boolean(workspace?.location),
    Boolean(workspace?.phone),
    Boolean(workspace?.linkedin || workspace?.website),
    (workspace?.goals || []).length > 0,
    (workspace?.wins || []).length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function SectionCard({ className = '', children }) {
  return (
    <section className={cn('rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7', className)}>
      {children}
    </section>
  );
}

function StatCard({ label, value, hint, tone = 'blue' }) {
  const tones = {
    blue: 'from-sky-50 to-cyan-50 text-sky-700',
    green: 'from-emerald-50 to-teal-50 text-emerald-700',
    amber: 'from-amber-50 to-orange-50 text-amber-700',
    violet: 'from-violet-50 to-fuchsia-50 text-violet-700',
  };

  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className={cn('inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]', tones[tone])}>
        {label}
      </div>
      <div className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{value}</div>
      <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100',
        props.className
      )}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100',
        props.className
      )}
    />
  );
}

function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-sky-100 text-sky-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
  };

  return <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', tones[tone])}>{children}</span>;
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const [accountForm, setAccountForm] = useState({ fullName: '', currentPassword: '', newPassword: '' });
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountMessage, setAccountMessage] = useState('');
  const [stats, setStats] = useState({ enrolledCourses: [], certificates: [], activities: [] });
  const [goalDraft, setGoalDraft] = useState('');
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editingGoalValue, setEditingGoalValue] = useState('');
  const [winDraft, setWinDraft] = useState('');
  const [editingWinId, setEditingWinId] = useState(null);
  const [editingWinValue, setEditingWinValue] = useState('');
  const [linkDraft, setLinkDraft] = useState({ label: '', url: '' });
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editingLinkValue, setEditingLinkValue] = useState({ label: '', url: '' });

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      const currentUser = await getCurrentUser();

      if (!currentUser.data?.user) {
        if (!ignore) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      const authUser = currentUser.data.user;

      if (!ignore) {
        setUser(authUser);
        setAccountForm(prev => ({
          ...prev,
          fullName: authUser.fullName || authUser.full_name || '',
        }));
        setWorkspace(loadWorkspace(authUser));
        setWorkspaceReady(true);
      }

      const [enrollmentsRes, certificatesRes, activitiesRes] = await Promise.all([
        apiGet('/api/v1/enrollments'),
        apiGet('/api/v1/certificates'),
        apiGet('/api/v1/activity?limit=6'),
      ]);

      if (ignore) return;

      setStats({
        enrolledCourses: Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : [],
        certificates: Array.isArray(certificatesRes.data) ? certificatesRes.data : [],
        activities: Array.isArray(activitiesRes.data) ? activitiesRes.data : [],
      });
      setLoading(false);
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!user || !workspaceReady || !workspace) return;
    saveWorkspace(user, workspace);
  }, [user, workspace, workspaceReady]);

  const completion = useMemo(() => calculateCompletion(user, workspace), [user, workspace]);
  const displayName = user?.fullName || user?.full_name || 'User';
  const initials = (displayName || user?.email || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
  const completedGoals = workspace?.goals?.filter(goal => goal.done).length || 0;
  const totalGoals = workspace?.goals?.length || 0;
  const activeLinks = workspace?.links?.length || 0;

  function updateWorkspaceField(field, value) {
    setWorkspace(prev => ({ ...prev, [field]: value }));
  }

  async function handleAccountSave(event) {
    event.preventDefault();
    setAccountSaving(true);
    setAccountMessage('');

    const body = { fullName: accountForm.fullName };
    if (accountForm.currentPassword && accountForm.newPassword) {
      body.currentPassword = accountForm.currentPassword;
      body.newPassword = accountForm.newPassword;
    }

    const response = await apiPatch('/api/v1/users/me', body);

    if (response.error) {
      setAccountMessage(response.error.message || 'Unable to update profile right now.');
      setAccountSaving(false);
      return;
    }

    setUser(prev => ({ ...prev, fullName: accountForm.fullName }));
    setAccountForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    setAccountMessage('Profile updated successfully.');
    setAccountSaving(false);
  }

  function addGoal() {
    if (!goalDraft.trim()) return;
    setWorkspace(prev => ({
      ...prev,
      goals: [{ id: makeId('goal'), title: goalDraft.trim(), done: false }, ...prev.goals],
    }));
    setGoalDraft('');
  }

  function updateGoal(id, nextTitle) {
    setWorkspace(prev => ({
      ...prev,
      goals: prev.goals.map(goal => (goal.id === id ? { ...goal, title: nextTitle } : goal)),
    }));
  }

  function toggleGoal(id) {
    setWorkspace(prev => ({
      ...prev,
      goals: prev.goals.map(goal => (goal.id === id ? { ...goal, done: !goal.done } : goal)),
    }));
  }

  function deleteGoal(id) {
    setWorkspace(prev => ({ ...prev, goals: prev.goals.filter(goal => goal.id !== id) }));
  }

  function addWin() {
    if (!winDraft.trim()) return;
    setWorkspace(prev => ({
      ...prev,
      wins: [{ id: makeId('win'), title: winDraft.trim(), date: new Date().toISOString() }, ...prev.wins],
    }));
    setWinDraft('');
  }

  function updateWin(id, nextTitle) {
    setWorkspace(prev => ({
      ...prev,
      wins: prev.wins.map(win => (win.id === id ? { ...win, title: nextTitle } : win)),
    }));
  }

  function deleteWin(id) {
    setWorkspace(prev => ({ ...prev, wins: prev.wins.filter(win => win.id !== id) }));
  }

  function addLink() {
    if (!linkDraft.label.trim() || !linkDraft.url.trim()) return;
    setWorkspace(prev => ({
      ...prev,
      links: [{ id: makeId('link'), label: linkDraft.label.trim(), url: linkDraft.url.trim() }, ...prev.links],
    }));
    setLinkDraft({ label: '', url: '' });
  }

  function updateLink(id, nextValue) {
    setWorkspace(prev => ({
      ...prev,
      links: prev.links.map(link => (link.id === id ? { ...link, ...nextValue } : link)),
    }));
  }

  function deleteLink(id) {
    setWorkspace(prev => ({ ...prev, links: prev.links.filter(link => link.id !== id) }));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_24%),#f8fafc] px-6 py-16">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-14 w-72 rounded-3xl bg-white/80" />
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              <div className="h-72 rounded-[32px] bg-white/90" />
              <div className="grid gap-4 md:grid-cols-3">
                {[0, 1, 2].map(item => (
                  <div key={item} className="h-36 rounded-[28px] bg-white/90" />
                ))}
              </div>
            </div>
            <div className="h-[420px] rounded-[32px] bg-white/90" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || !workspace) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_32%),#f8fafc] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Authentication required
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">Please log in to view your profile.</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Sign in to access your personalized profile studio, account controls, and progress insights.
          </p>
          <Link href="/login" className="mt-8 inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_20%),linear-gradient(180deg,_#f8fbff_0%,_#f8fafc_100%)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1360px] space-y-6">
        <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-[linear-gradient(135deg,_rgba(14,165,233,0.14),_rgba(16,185,129,0.10)_45%,_rgba(251,191,36,0.12))] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="blue">Profile Studio</Badge>
                  <Badge tone="green">{completion}% complete</Badge>
                  <Badge tone="amber">{workspace.focusWord}</Badge>
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 text-3xl font-bold text-white shadow-lg shadow-sky-200">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{displayName}</h1>
                    <p className="mt-2 text-lg text-slate-600">{workspace.headline}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge tone="slate">{user.role || 'user'}</Badge>
                      <Badge tone="blue">{workspace.energy}</Badge>
                      <Badge tone="green">{workspace.availability}</Badge>
                    </div>
                  </div>
                </div>

                <p className="max-w-3xl text-[15px] leading-8 text-slate-600">{workspace.bio}</p>

                <div className="flex flex-wrap gap-3">
                  <Link href="/dashboard" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Go to dashboard
                  </Link>
                  <a href="#profile-editor" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300">
                    Edit profile
                  </a>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Momentum dashboard</div>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                      <span>Profile strength</span>
                      <span>{completion}%</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-slate-100">
                      <div className="h-3 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500" style={{ width: `${completion}%` }} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-sky-50 px-4 py-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Current energy</div>
                      <div className="mt-2 text-lg font-semibold text-slate-950">{workspace.energy}</div>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 px-4 py-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Ambition mode</div>
                      <div className="mt-2 text-lg font-semibold text-slate-950">{workspace.ambition}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-amber-50 px-4 py-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">Crazy feature: Focus word</div>
                    <div className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{workspace.focusWord}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Use this as your personal identity anchor for the week. Keep it visible, keep it actionable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Courses" value={stats.enrolledCourses.length} hint="Programs currently enrolled" tone="blue" />
          <StatCard label="Certificates" value={stats.certificates.length} hint="Proof of completed milestones" tone="green" />
          <StatCard label="Goals" value={`${completedGoals}/${totalGoals || 0}`} hint="Weekly goals completed" tone="amber" />
          <StatCard label="Links" value={activeLinks} hint="Public profile and contact links" tone="violet" />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <SectionCard className="bg-[linear-gradient(180deg,_rgba(255,255,255,1),_rgba(248,250,252,1))]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">Profile insights</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Your startup identity, designed to attract attention</h2>
                </div>
                <Badge tone="blue">{workspace.location}</Badge>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[26px] border border-slate-200 bg-white p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">About</div>
                  <p className="mt-3 text-[15px] leading-7 text-slate-600">{workspace.bio}</p>
                </div>
                <div className="rounded-[26px] border border-slate-200 bg-white p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Signals</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge tone="blue">{workspace.timezone}</Badge>
                    <Badge tone="green">{workspace.availability}</Badge>
                    <Badge tone="amber">{workspace.energy}</Badge>
                    <Badge tone="slate">{workspace.ambition}</Badge>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="profile-editor">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">Edit core profile</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Identity + account controls</h2>
                </div>
                <Badge tone="slate">Server + local save</Badge>
              </div>

              <form onSubmit={handleAccountSave} className="mt-6 grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Full name" hint="server-backed">
                    <Input value={accountForm.fullName} onChange={event => setAccountForm(prev => ({ ...prev, fullName: event.target.value }))} placeholder="Your full name" />
                  </Field>
                  <Field label="Email" hint="read-only">
                    <Input value={user.email || ''} disabled className="cursor-not-allowed bg-slate-100 text-slate-500" />
                  </Field>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Current password" hint="optional">
                    <Input type="password" value={accountForm.currentPassword} onChange={event => setAccountForm(prev => ({ ...prev, currentPassword: event.target.value }))} placeholder="Enter current password" />
                  </Field>
                  <Field label="New password" hint="optional">
                    <Input type="password" value={accountForm.newPassword} onChange={event => setAccountForm(prev => ({ ...prev, newPassword: event.target.value }))} placeholder="Enter new password" />
                  </Field>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Headline" hint="local profile">
                    <Input value={workspace.headline} onChange={event => updateWorkspaceField('headline', event.target.value)} />
                  </Field>
                  <Field label="Phone" hint="local profile">
                    <Input value={workspace.phone} onChange={event => updateWorkspaceField('phone', event.target.value)} placeholder="+91 90000 00000" />
                  </Field>
                </div>

                <Field label="Bio" hint="local profile">
                  <Textarea rows={4} value={workspace.bio} onChange={event => updateWorkspaceField('bio', event.target.value)} />
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Location" hint="local profile">
                    <Input value={workspace.location} onChange={event => updateWorkspaceField('location', event.target.value)} />
                  </Field>
                  <Field label="Timezone" hint="local profile">
                    <Input value={workspace.timezone} onChange={event => updateWorkspaceField('timezone', event.target.value)} />
                  </Field>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Website" hint="local profile">
                    <Input value={workspace.website} onChange={event => updateWorkspaceField('website', event.target.value)} placeholder="https://yourwebsite.com" />
                  </Field>
                  <Field label="LinkedIn" hint="local profile">
                    <Input value={workspace.linkedin} onChange={event => updateWorkspaceField('linkedin', event.target.value)} placeholder="https://linkedin.com/in/you" />
                  </Field>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <Field label="Focus word">
                    <Input value={workspace.focusWord} onChange={event => updateWorkspaceField('focusWord', event.target.value)} />
                  </Field>
                  <Field label="Energy mode">
                    <Input value={workspace.energy} onChange={event => updateWorkspaceField('energy', event.target.value)} />
                  </Field>
                  <Field label="Ambition mode">
                    <Input value={workspace.ambition} onChange={event => updateWorkspaceField('ambition', event.target.value)} />
                  </Field>
                </div>

                {accountMessage ? (
                  <div className={cn('rounded-2xl px-4 py-3 text-sm', accountMessage.toLowerCase().includes('success') || accountMessage.toLowerCase().includes('updated') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>
                    {accountMessage}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={accountSaving} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
                    {accountSaving ? 'Saving...' : 'Save account changes'}
                  </button>
                  <button type="button" onClick={() => setWorkspace(loadWorkspace(user))} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300">
                    Reset local profile
                  </button>
                </div>
              </form>
            </SectionCard>

            <SectionCard>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">Goals CRUD</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Personal growth board</h2>
                </div>
                <Badge tone="green">{completedGoals} completed</Badge>
              </div>

              <div className="mt-6 flex gap-3">
                <Input value={goalDraft} onChange={event => setGoalDraft(event.target.value)} placeholder="Add a new weekly goal" />
                <button type="button" onClick={addGoal} className="shrink-0 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                  Add
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {workspace.goals.length > 0 ? workspace.goals.map(goal => (
                  <div key={goal.id} className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <button type="button" onClick={() => toggleGoal(goal.id)} className={cn('h-6 w-6 shrink-0 rounded-full border-2 transition', goal.done ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white')} />
                      <div className="min-w-0 flex-1">
                        {editingGoalId === goal.id ? <Input value={editingGoalValue} onChange={event => setEditingGoalValue(event.target.value)} /> : <p className={cn('text-sm font-medium', goal.done ? 'text-slate-400 line-through' : 'text-slate-800')}>{goal.title}</p>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingGoalId === goal.id ? (
                          <>
                            <button type="button" onClick={() => { updateGoal(goal.id, editingGoalValue.trim() || goal.title); setEditingGoalId(null); setEditingGoalValue(''); }} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Save</button>
                            <button type="button" onClick={() => { setEditingGoalId(null); setEditingGoalValue(''); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button type="button" onClick={() => { setEditingGoalId(goal.id); setEditingGoalValue(goal.title); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">Edit</button>
                            <button type="button" onClick={() => deleteGoal(goal.id)} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">Delete</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )) : <EmptyState title="No goals yet" description="Create your first focus goal and start turning profile energy into visible execution." />}
              </div>
            </SectionCard>

            <SectionCard>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">Wins CRUD</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Momentum timeline</h2>
                </div>
                <Badge tone="amber">{workspace.wins.length} wins tracked</Badge>
              </div>

              <div className="mt-6 flex gap-3">
                <Input value={winDraft} onChange={event => setWinDraft(event.target.value)} placeholder="Add a recent win, breakthrough, or milestone" />
                <button type="button" onClick={addWin} className="shrink-0 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600">
                  Add
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {workspace.wins.length > 0 ? workspace.wins.map(win => (
                  <div key={win.id} className="rounded-[24px] border border-slate-200 bg-white px-4 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start">
                      <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-amber-400" />
                      <div className="min-w-0 flex-1">
                        {editingWinId === win.id ? <Input value={editingWinValue} onChange={event => setEditingWinValue(event.target.value)} /> : <p className="text-sm font-medium text-slate-800">{win.title}</p>}
                        <p className="mt-2 text-xs text-slate-400">{new Date(win.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingWinId === win.id ? (
                          <>
                            <button type="button" onClick={() => { updateWin(win.id, editingWinValue.trim() || win.title); setEditingWinId(null); setEditingWinValue(''); }} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Save</button>
                            <button type="button" onClick={() => { setEditingWinId(null); setEditingWinValue(''); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button type="button" onClick={() => { setEditingWinId(win.id); setEditingWinValue(win.title); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">Edit</button>
                            <button type="button" onClick={() => deleteWin(win.id)} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">Delete</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )) : <EmptyState title="No wins tracked yet" description="Capture progress here so your profile feels alive, motivating, and visibly active." />}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard className="bg-[linear-gradient(180deg,_rgba(255,255,255,1),_rgba(248,250,252,1))]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700">Public preview</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">How you appear</h2>
                </div>
                <Badge tone="slate">{workspace.focusWord}</Badge>
              </div>

              <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-white shadow-lg shadow-slate-300">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/10 text-2xl font-bold">{initials}</div>
                  <div>
                    <h3 className="text-xl font-semibold">{displayName}</h3>
                    <p className="mt-1 text-sm text-white/70">{workspace.headline}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">{workspace.location}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">{workspace.energy}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">{workspace.availability}</span>
                </div>
                <p className="mt-5 text-sm leading-7 text-white/75">{workspace.bio}</p>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700">Links CRUD</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Profile links</h2>
                </div>
                <Badge tone="blue">{workspace.links.length} active</Badge>
              </div>

              <div className="mt-6 grid gap-3">
                <Input value={linkDraft.label} onChange={event => setLinkDraft(prev => ({ ...prev, label: event.target.value }))} placeholder="Link label e.g. LinkedIn" />
                <Input value={linkDraft.url} onChange={event => setLinkDraft(prev => ({ ...prev, url: event.target.value }))} placeholder="https://..." />
                <button type="button" onClick={addLink} className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
                  Add link
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {workspace.links.length > 0 ? workspace.links.map(link => (
                  <div key={link.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    {editingLinkId === link.id ? (
                      <div className="space-y-3">
                        <Input value={editingLinkValue.label} onChange={event => setEditingLinkValue(prev => ({ ...prev, label: event.target.value }))} />
                        <Input value={editingLinkValue.url} onChange={event => setEditingLinkValue(prev => ({ ...prev, url: event.target.value }))} />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => { updateLink(link.id, editingLinkValue); setEditingLinkId(null); setEditingLinkValue({ label: '', url: '' }); }} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Save</button>
                          <button type="button" onClick={() => { setEditingLinkId(null); setEditingLinkValue({ label: '', url: '' }); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">{link.label}</p>
                          <p className="truncate text-sm text-slate-500">{link.url}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <a href={link.url} target="_blank" rel="noreferrer" className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">Open</a>
                          <button type="button" onClick={() => { setEditingLinkId(link.id); setEditingLinkValue({ label: link.label, url: link.url }); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">Edit</button>
                          <button type="button" onClick={() => deleteLink(link.id)} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                )) : <EmptyState title="No profile links yet" description="Add your best public links to make your profile feel credible and discoverable." />}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
      </div>
    );
}

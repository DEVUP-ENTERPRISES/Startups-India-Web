'use client';
import { UserCheck, TrendingUp, Users, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Step1RoleSelection({ selectedRole, onSelectRole }) {
  const roles = [
    {
      id: 'startup',
      title: 'Startup',
      description: 'A student, founder, or early-stage startup looking for funding, mentorship & growth.',
      icon: <Users size={26} />,
      requiresApproval: false,
      badge: null,
    },
    {
      id: 'mentor',
      title: 'Mentor',
      description: 'An industry expert guiding and supporting startups with domain knowledge.',
      icon: <UserCheck size={26} />,
      requiresApproval: true,
      badge: 'Requires Approval',
    },
    {
      id: 'investor',
      title: 'Investor',
      description: 'An angel, VC, or family office investing in high-growth startups.',
      icon: <TrendingUp size={26} />,
      requiresApproval: true,
      badge: 'Requires Approval',
    },
  ];

  return (
    <div>
      <div className="reg-v2-content-header">
        <h2 className="reg-v2-content-title">Choose Your <span>Role</span></h2>
        <p className="reg-v2-content-subtitle">
          Select the role that best describes you to personalize your journey.
        </p>
      </div>

      <div className="reg-v2-role-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {roles.map((role, idx) => {
          const isSelected = selectedRole === role.id;
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.06 }}
              className={`reg-v2-role-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectRole(role.id)}
            >
              {isSelected && (
                <div className="reg-v2-role-badge">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}

              <div className="reg-v2-role-icon-wrapper">{role.icon}</div>
              <h3 className="reg-v2-role-title">{role.title}</h3>
              <p className="reg-v2-role-desc">{role.description}</p>

              {role.badge && (
                <div style={{
                  marginTop: '10px',
                  display: 'inline-block',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#dc2626',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '20px',
                  padding: '2px 10px',
                  letterSpacing: '0.03em',
                }}>
                  {role.badge}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

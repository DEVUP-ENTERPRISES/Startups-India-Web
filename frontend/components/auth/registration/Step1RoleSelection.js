'use client';
import { GraduationCap, Rocket, UserCheck, TrendingUp, Briefcase, User, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Step1RoleSelection({ selectedRole, onSelectRole }) {
  const roles = [
    {
      id: 'startup',
      title: 'Startup',
      description: 'Building my venture and looking for funding & acceleration.',
      icon: <Rocket size={26} />,
      requiresApproval: true,
    },
    {
      id: 'founder',
      title: 'Founder / Student',
      description: 'Leading a company, scaling product, market & team (includes students).',
      icon: <User size={26} />,
      requiresApproval: false, // Combined student/founder lands on founder dashboard directly
    },
    {
      id: 'mentor',
      title: 'Mentor',
      description: 'Guiding and supporting startups with domain expertise.',
      icon: <UserCheck size={26} />,
      requiresApproval: true,
    },
    {
      id: 'investor',
      title: 'Investor',
      description: 'Investing in promising high-growth startups and ideas.',
      icon: <TrendingUp size={26} />,
      requiresApproval: true,
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



      <div className="reg-v2-role-grid">
        {roles.map((role, idx) => {
          const isSelected = selectedRole === role.id;
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

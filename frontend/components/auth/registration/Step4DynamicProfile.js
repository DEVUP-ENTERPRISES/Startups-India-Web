'use client';
import React, { useRef, useState } from 'react';
import { 
  Building, 
  GraduationCap, 
  MapPin, 
  Globe, 
  Briefcase, 
  Calendar, 
  Users, 
  Award, 
  HelpCircle,
  User,
  DollarSign,
  CheckCircle2,
  FileText,
  Clock,
  Link as LinkIcon,
  Tag,
  UploadCloud,
  X,
  Plus
} from 'lucide-react';

const LinkedinIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const GithubIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

// Drag & Drop Local Image Upload Component
const ImageUploadDropzone = ({ label, value, onChange }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result); // Base64 Data URL for local display & storage
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="reg-v2-field-group" style={{ width: '100%' }}>
      <label className="reg-v2-label">{label}</label>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {value ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '12px 16px',
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '12px',
          marginTop: '4px'
        }}>
          <img
            src={value}
            alt="Uploaded Preview"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '2px solid #dc2626',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Local Image Uploaded ✓</div>
            <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px' }}>Ready to save to profile</div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #fca5a5',
              background: '#fef2f2',
              color: '#dc2626',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <X size={14} /> Remove
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: isDragging ? '2px dashed #dc2626' : '2px dashed #cbd5e1',
            background: isDragging ? '#fef2f2' : '#f8fafc',
            borderRadius: '12px',
            padding: '16px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '4px'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UploadCloud size={20} />
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
            Drag & drop photo here or <span style={{ color: '#dc2626', textDecoration: 'underline' }}>browse local files</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            Supports PNG, JPG, JPEG, WEBP up to 5MB
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Multi-Select Pill Component with Addable Custom Pills via "+ Others"
const MultiSelectPills = ({ 
  options, 
  selectedValues = [], 
  onChange, 
  placeholder = "Type custom value and click + Add..." 
}) => {
  const values = Array.isArray(selectedValues) ? selectedValues : (selectedValues ? [selectedValues] : []);
  const [customInput, setCustomInput] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  // Combine default preset options and all dynamically added custom values
  const allPills = Array.from(new Set([...options, ...values]));

  const toggleOption = (opt) => {
    if (values.includes(opt)) {
      onChange(values.filter(o => o !== opt));
    } else {
      onChange([...values, opt]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setCustomInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
        {allPills.map((opt) => {
          const isSelected = values.includes(opt);
          return (
            <button
              type="button"
              key={opt}
              onClick={() => toggleOption(opt)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                border: isSelected ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
                background: isSelected ? '#fef2f2' : '#f8fafc',
                color: isSelected ? '#dc2626' : '#475569',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {isSelected ? '✓ ' : '+ '}{opt}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowOtherInput(!showOtherInput)}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            border: showOtherInput ? '1.5px solid #0f172a' : '1.5px dashed #dc2626',
            background: showOtherInput ? '#0f172a' : '#fff5f5',
            color: showOtherInput ? '#ffffff' : '#dc2626',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {showOtherInput ? '✓ Close Input' : '+ Others'}
        </button>
      </div>

      {showOtherInput && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
          <input
            type="text"
            className="reg-v2-input no-icon"
            placeholder={placeholder}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ fontSize: '13px', flex: 1 }}
          />
          <button
            type="button"
            onClick={handleAddCustom}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              background: '#dc2626',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={15} /> Add
          </button>
        </div>
      )}
    </div>
  );
};

// Section Divider Header
const SectionHeader = ({ title }) => (
  <div style={{ 
    fontSize: '13px', 
    fontWeight: 700, 
    color: '#0f172a', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em',
    marginBottom: '12px',
    marginTop: '20px',
    paddingBottom: '6px',
    borderBottom: '1.5px solid #e2e8f0'
  }}>
    {title}
  </div>
);

export default function Step4DynamicProfile({ role, profileData = {}, onChange }) {
  const getRoleTitle = (r) => {
    switch (r) {
      case 'student': return 'Student';
      case 'startup': return 'Startup';
      case 'founder': return 'Founder / Student';
      case 'mentor': return 'Mentor';
      case 'investor': return 'Investor';
      case 'service_provider': return 'Service Provider';
      default: return 'User';
    }
  };

  const countWords = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleDigitsOnly = (field, val, maxLen = 3) => {
    const digits = val.replace(/\D/g, '').slice(0, maxLen);
    onChange(field, digits);
  };

  const renderFormFields = () => {
    switch (role) {
      /* ==========================================
         1. STUDENT ROLE
         ========================================== */
      case 'student':
        return (
          <>
            <SectionHeader title="Personal Information" />
            <div className="reg-v2-form-row">
              <ImageUploadDropzone
                label="Profile Photo (Optional)"
                value={profileData.profilePhoto}
                onChange={(val) => onChange('profilePhoto', val)}
              />

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Date of Birth (Optional)</label>
                <div className="reg-v2-input-wrapper">
                  <Calendar className="reg-v2-input-icon" size={18} />
                  <input
                    type="date"
                    className="reg-v2-input"
                    value={profileData.dob || ''}
                    onChange={(e) => onChange('dob', e.target.value)}
                  />
                </div>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Gender (Optional)</label>
                <select
                  className="reg-v2-select no-icon"
                  value={profileData.gender || ''}
                  onChange={(e) => onChange('gender', e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <SectionHeader title="Educational Details" />
            <div className="reg-v2-form-row">
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">College / University *</label>
                <div className="reg-v2-input-wrapper">
                  <Building className="reg-v2-input-icon" size={18} />
                  <input
                    type="text"
                    className="reg-v2-input"
                    placeholder="Enter your college or university name"
                    value={profileData.collegeName || ''}
                    onChange={(e) => onChange('collegeName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Course / Degree *</label>
                <div className="reg-v2-input-wrapper">
                  <GraduationCap className="reg-v2-input-icon" size={18} />
                  <input
                    type="text"
                    className="reg-v2-input"
                    placeholder="e.g. B.Tech, B.Sc, B.Com, MBA"
                    value={profileData.degree || ''}
                    onChange={(e) => onChange('degree', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="reg-v2-form-row">
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Branch / Specialization *</label>
                <div className="reg-v2-input-wrapper">
                  <GraduationCap className="reg-v2-input-icon" size={18} />
                  <input
                    type="text"
                    className="reg-v2-input"
                    placeholder="e.g. Computer Science, AI, Mechanical"
                    value={profileData.stream || ''}
                    onChange={(e) => onChange('stream', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Current Year *</label>
                <select
                  className="reg-v2-select no-icon"
                  value={profileData.yearOfStudy || ''}
                  onChange={(e) => onChange('yearOfStudy', e.target.value)}
                  required
                >
                  <option value="">Select current year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Post Graduate">Post Graduate</option>
                  <option value="Ph.D">Ph.D</option>
                </select>
              </div>
            </div>

            <div className="reg-v2-form-row">
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Graduation Year *</label>
                <select
                  className="reg-v2-select no-icon"
                  value={profileData.graduationYear || ''}
                  onChange={(e) => onChange('graduationYear', e.target.value)}
                  required
                >
                  <option value="">Select year</option>
                  {['2024', '2025', '2026', '2027', '2028', '2029', '2030'].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">College City *</label>
                <div className="reg-v2-input-wrapper">
                  <MapPin className="reg-v2-input-icon" size={18} />
                  <input
                    type="text"
                    className="reg-v2-input"
                    placeholder="Enter city"
                    value={profileData.city || ''}
                    onChange={(e) => onChange('city', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Student ID (Optional)</label>
                <div className="reg-v2-input-wrapper">
                  <Award className="reg-v2-input-icon" size={18} />
                  <input
                    type="text"
                    className="reg-v2-input"
                    placeholder="Student Roll / ID Number"
                    value={profileData.studentId || ''}
                    onChange={(e) => onChange('studentId', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <SectionHeader title="Career Interests" />
            <div className="reg-v2-field-group">
              <label className="reg-v2-label">Looking For (Multi-select) *</label>
              <MultiSelectPills
                options={['Internship', 'Startup Job', 'Co-founder', 'Learning', 'Funding', 'Networking']}
                selectedValues={profileData.lookingFor || []}
                onChange={(vals) => onChange('lookingFor', vals)}
                placeholder="Type custom career interest and click + Add..."
              />
            </div>

            <SectionHeader title="Skills" />
            <div className="reg-v2-field-group">
              <label className="reg-v2-label">Select Skills (Multi-select) *</label>
              <MultiSelectPills
                options={['UI/UX', 'React', 'AI / ML', 'Marketing', 'Finance', 'Sales', 'Design', 'Business Development', 'Python', 'Node.js', 'Cloud Computing', 'Product Management']}
                selectedValues={profileData.skills || []}
                onChange={(vals) => onChange('skills', vals)}
                placeholder="Type custom skill (e.g. Flutter) & click + Add..."
              />
            </div>

            <SectionHeader title="Social Links" />
            <div className="reg-v2-form-row">
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">LinkedIn Profile *</label>
                <div className="reg-v2-input-wrapper">
                  <LinkedinIcon className="reg-v2-input-icon" size={18} />
                  <input
                    type="url"
                    className="reg-v2-input"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={profileData.linkedin || ''}
                    onChange={(e) => onChange('linkedin', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Portfolio Website (Optional)</label>
                <div className="reg-v2-input-wrapper">
                  <Globe className="reg-v2-input-icon" size={18} />
                  <input
                    type="url"
                    className="reg-v2-input"
                    placeholder="https://yourportfolio.com"
                    value={profileData.portfolio || ''}
                    onChange={(e) => onChange('portfolio', e.target.value)}
                  />
                </div>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">GitHub Profile (Optional)</label>
                <div className="reg-v2-input-wrapper">
                  <GithubIcon className="reg-v2-input-icon" size={18} />
                  <input
                    type="url"
                    className="reg-v2-input"
                    placeholder="https://github.com/username"
                    value={profileData.github || ''}
                    onChange={(e) => onChange('github', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        );

      /* ==========================================
         2. STARTUP ROLE
         ========================================== */
      case 'startup':
        {
          const probWords = countWords(profileData.problemStatement || '');
          const descWords = countWords(profileData.description || '');

          return (
            <>
              <SectionHeader title="Startup Information" />
              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Startup Name *</label>
                  <div className="reg-v2-input-wrapper">
                    <Building className="reg-v2-input-icon" size={18} />
                    <input
                      type="text"
                      className="reg-v2-input"
                      placeholder="Enter startup name"
                      value={profileData.startupName || ''}
                      onChange={(e) => onChange('startupName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Startup Stage *</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.startupStage || ''}
                    onChange={(e) => onChange('startupStage', e.target.value)}
                    required
                  >
                    <option value="">Select startup stage</option>
                    <option value="Idea">Idea</option>
                    <option value="MVP">MVP</option>
                    <option value="Early Revenue">Early Revenue</option>
                    <option value="Growth">Growth</option>
                    <option value="Scaling">Scaling</option>
                  </select>
                </div>
              </div>

              <div className="reg-v2-form-row">
                <ImageUploadDropzone
                  label="Startup Logo (Optional)"
                  value={profileData.startupLogo}
                  onChange={(val) => onChange('startupLogo', val)}
                />

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Startup Website (Optional)</label>
                  <div className="reg-v2-input-wrapper">
                    <Globe className="reg-v2-input-icon" size={18} />
                    <input
                      type="url"
                      className="reg-v2-input"
                      placeholder="https://yourstartup.com"
                      value={profileData.website || ''}
                      onChange={(e) => onChange('website', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <SectionHeader title="Business Details" />
              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Industry *</label>
                  <div className="reg-v2-input-wrapper">
                    <Briefcase className="reg-v2-input-icon" size={18} />
                    <input
                      type="text"
                      className="reg-v2-input"
                      placeholder="e.g. EdTech, FinTech, AI, SaaS"
                      value={profileData.industry || ''}
                      onChange={(e) => onChange('industry', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Year Founded *</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.yearFounded || ''}
                    onChange={(e) => onChange('yearFounded', e.target.value)}
                    required
                  >
                    <option value="">Select year founded</option>
                    {['2026', '2025', '2024', '2023', '2022', '2021', '2020', 'Before 2020'].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Team Size *</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.teamSize || ''}
                    onChange={(e) => onChange('teamSize', e.target.value)}
                    required
                  >
                    <option value="">Select team size</option>
                    <option value="1-5">1 - 5 members</option>
                    <option value="6-20">6 - 20 members</option>
                    <option value="21-50">21 - 50 members</option>
                    <option value="50+">50+ members</option>
                  </select>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Headquarters *</label>
                  <div className="reg-v2-input-wrapper">
                    <MapPin className="reg-v2-input-icon" size={18} />
                    <input
                      type="text"
                      className="reg-v2-input"
                      placeholder="City, State"
                      value={profileData.city || ''}
                      onChange={(e) => onChange('city', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Registered Company? *</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.isRegistered || ''}
                    onChange={(e) => onChange('isRegistered', e.target.value)}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Yes">Yes (Pvt Ltd / LLP / OPC)</option>
                    <option value="No">No (Proprietorship / Unregistered)</option>
                  </select>
                </div>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Problem Statement *</label>
                <textarea
                  className="reg-v2-textarea no-icon"
                  rows={2}
                  placeholder="What core problem does your startup solve?"
                  value={profileData.problemStatement || ''}
                  onChange={(e) => onChange('problemStatement', e.target.value)}
                  required
                />
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Short Description / Elevator Pitch (Min 20 Words) *</label>
                <textarea
                  className="reg-v2-textarea no-icon"
                  rows={3}
                  placeholder="Describe your solution, target market, product & vision..."
                  value={profileData.description || ''}
                  onChange={(e) => onChange('description', e.target.value)}
                  required
                />
                <p style={{ fontSize: '11px', color: descWords >= 20 ? '#059669' : '#ef4444', marginTop: '4px' }}>
                  {descWords >= 20 ? `✓ Word count requirement met (${descWords} words)` : `✕ Minimum 20 words required (${descWords}/20 words)`}
                </p>
              </div>

              <SectionHeader title="Funding Details" />
              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Funding Stage</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.fundingStage || ''}
                    onChange={(e) => onChange('fundingStage', e.target.value)}
                  >
                    <option value="">Select funding stage</option>
                    <option value="Bootstrapped">Bootstrapped</option>
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B+">Series B+</option>
                  </select>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Revenue Range (Optional)</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.revenueRange || ''}
                    onChange={(e) => onChange('revenueRange', e.target.value)}
                  >
                    <option value="">Select revenue range</option>
                    <option value="Pre-Revenue">Pre-Revenue</option>
                    <option value="< ₹10L/year">&lt; ₹10L / year</option>
                    <option value="₹10L - ₹50L/year">₹10L - ₹50L / year</option>
                    <option value="₹50L - ₹2Cr/year">₹50L - ₹2Cr / year</option>
                    <option value="₹2Cr+/year">₹2Cr+ / year</option>
                  </select>
                </div>
              </div>

              <SectionHeader title="Startup Needs" />
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Select Startup Needs (Multi-select) *</label>
                <MultiSelectPills
                  options={['Mentorship', 'Funding', 'Hiring', 'Incubation', 'Investors', 'Government Schemes', 'Partnerships']}
                  selectedValues={profileData.startupNeeds || []}
                  onChange={(vals) => onChange('startupNeeds', vals)}
                  placeholder="Type custom startup need and click + Add..."
                />
              </div>
            </>
          );
        }

      /* ==========================================
         3. FOUNDER ROLE
         ========================================== */
      case 'founder':
        {
          const bioWords = countWords(profileData.bio || '');
          const isStudent = profileData.isStudent === 'Yes';

          return (
            <>
              <SectionHeader title="Founder / Student Information" />
              
              <div className="reg-v2-form-row" style={{ gridColumn: 'span 3' }}>
                <div className="reg-v2-field-group" style={{ width: '100%' }}>
                  <label className="reg-v2-label">Are you registering as a Student? *</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.isStudent || 'No'}
                    onChange={(e) => {
                      onChange('isStudent', e.target.value);
                      if (e.target.value === 'Yes') {
                        onChange('designation', 'Student');
                        onChange('yearsOfExperience', '0');
                      } else {
                        onChange('designation', '');
                        onChange('yearsOfExperience', '');
                      }
                    }}
                    required
                  >
                    <option value="No">No, I am a professional founder</option>
                    <option value="Yes">Yes, I am a student / aspiring founder</option>
                  </select>
                </div>
              </div>

              <div className="reg-v2-form-row">
                <ImageUploadDropzone
                  label="Profile Photo (Optional)"
                  value={profileData.profilePhoto}
                  onChange={(val) => onChange('profilePhoto', val)}
                />

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">{isStudent ? 'Designation / Current Course *' : 'Designation / Title *'}</label>
                  <div className="reg-v2-input-wrapper">
                    <Briefcase className="reg-v2-input-icon" size={18} />
                    <input
                      type="text"
                      className="reg-v2-input"
                      placeholder={isStudent ? "e.g. Student, B.Tech CSE" : "e.g. Founder & CEO, Co-Founder & CTO"}
                      value={profileData.designation || ''}
                      onChange={(e) => onChange('designation', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">{isStudent ? 'Startup or College/University Name *' : 'Startup Name *'}</label>
                  <div className="reg-v2-input-wrapper">
                    <Building className="reg-v2-input-icon" size={18} />
                    <input
                      type="text"
                      className="reg-v2-input"
                      placeholder={isStudent ? "Enter college name or startup if you have one" : "Enter startup name"}
                      value={profileData.startupName || ''}
                      onChange={(e) => onChange('startupName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">{isStudent ? 'Startup Stage (Optional for Students) *' : 'Startup Stage *'}</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.startupStage || ''}
                    onChange={(e) => onChange('startupStage', e.target.value)}
                    required
                  >
                    <option value="">Select startup stage</option>
                    <option value="Idea">Idea / Conceptual stage</option>
                    <option value="MVP">MVP built</option>
                    <option value="Early Revenue">Early Revenue</option>
                    <option value="Growth">Growth</option>
                    <option value="Scaling">Scaling</option>
                  </select>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Industry *</label>
                  <div className="reg-v2-input-wrapper">
                    <Briefcase className="reg-v2-input-icon" size={18} />
                    <input
                      type="text"
                      className="reg-v2-input"
                      placeholder="e.g. FinTech, AI, SaaS, Education"
                      value={profileData.industry || ''}
                      onChange={(e) => onChange('industry', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <SectionHeader title={isStudent ? 'Study Details' : 'Experience'} />
              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">{isStudent ? 'Year of Study (e.g. 3 for 3rd year) *' : 'Years of Experience *'}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="reg-v2-input no-icon"
                    placeholder={isStudent ? "e.g. 3" : "e.g. 5"}
                    value={profileData.yearsOfExperience || ''}
                    onChange={(e) => handleDigitsOnly('yearsOfExperience', e.target.value, 2)}
                    required
                  />
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Previous Startup?</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.previousStartup || ''}
                    onChange={(e) => onChange('previousStartup', e.target.value)}
                  >
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Previous Company (Optional)</label>
                  <input
                    type="text"
                    className="reg-v2-input no-icon"
                    placeholder="e.g. TCS, Google, Flipkart"
                    value={profileData.previousCompany || ''}
                    onChange={(e) => onChange('previousCompany', e.target.value)}
                  />
                </div>
              </div>

              <SectionHeader title="About Founder" />
              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Expertise / Domain *</label>
                  <input
                    type="text"
                    className="reg-v2-input no-icon"
                    placeholder="e.g. Product Strategy, AI, Growth Marketing"
                    value={profileData.domainExpertise || ''}
                    onChange={(e) => onChange('domainExpertise', e.target.value)}
                    required
                  />
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Current Location *</label>
                  <div className="reg-v2-input-wrapper">
                    <MapPin className="reg-v2-input-icon" size={18} />
                    <input
                      type="text"
                      className="reg-v2-input"
                      placeholder="Enter city"
                      value={profileData.city || ''}
                      onChange={(e) => onChange('city', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Short Bio (Min 20 Words) *</label>
                <textarea
                  className="reg-v2-textarea no-icon"
                  rows={3}
                  placeholder="Share your background, achievements, and vision for your startup..."
                  value={profileData.bio || ''}
                  onChange={(e) => onChange('bio', e.target.value)}
                  required
                />
                <p style={{ fontSize: '11px', color: bioWords >= 20 ? '#059669' : '#ef4444', marginTop: '4px' }}>
                  {bioWords >= 20 ? `✓ Word count requirement met (${bioWords} words)` : `✕ Minimum 20 words required (${bioWords}/20 words)`}
                </p>
              </div>

              <SectionHeader title="Looking For" />
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Select Options (Multi-select) *</label>
                <MultiSelectPills
                  options={['Co-founder', 'Funding', 'Mentorship', 'Hiring', 'Networking']}
                  selectedValues={profileData.lookingFor || []}
                  onChange={(vals) => onChange('lookingFor', vals)}
                  placeholder="Type custom requirement and click + Add..."
                />
              </div>

              <SectionHeader title="Social & Links" />
              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">LinkedIn Profile *</label>
                  <div className="reg-v2-input-wrapper">
                    <LinkedinIcon className="reg-v2-input-icon" size={18} />
                    <input
                      type="url"
                      className="reg-v2-input"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={profileData.linkedin || ''}
                      onChange={(e) => onChange('linkedin', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Personal Website (Optional)</label>
                  <div className="reg-v2-input-wrapper">
                    <Globe className="reg-v2-input-icon" size={18} />
                    <input
                      type="url"
                      className="reg-v2-input"
                      placeholder="https://yourwebsite.com"
                      value={profileData.website || ''}
                      onChange={(e) => onChange('website', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          );
        }

      /* ==========================================
         4. MENTOR ROLE
         ========================================== */
      case 'mentor':
        {
          const bioWords = countWords(profileData.bio || '');

          return (
            <>
              <SectionHeader title="Professional Details" />
              <div className="reg-v2-form-row">
                <ImageUploadDropzone
                  label="Profile Photo (Optional)"
                  value={profileData.profilePhoto}
                  onChange={(val) => onChange('profilePhoto', val)}
                />

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Company / Organization *</label>
                  <div className="reg-v2-input-wrapper">
                    <Building className="reg-v2-input-icon" size={18} />
                    <input
                      type="text"
                      className="reg-v2-input"
                      placeholder="Enter company name"
                      value={profileData.currentCompany || ''}
                      onChange={(e) => onChange('currentCompany', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Designation *</label>
                  <div className="reg-v2-input-wrapper">
                    <Briefcase className="reg-v2-input-icon" size={18} />
                    <input
                      type="text"
                      className="reg-v2-input"
                      placeholder="e.g. VP of Product, Engineering Lead"
                      value={profileData.designation || ''}
                      onChange={(e) => onChange('designation', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Industry *</label>
                  <input
                    type="text"
                    className="reg-v2-input no-icon"
                    placeholder="e.g. SaaS, FinTech, AI, DeepTech"
                    value={profileData.industry || ''}
                    onChange={(e) => onChange('industry', e.target.value)}
                    required
                  />
                </div>
              </div>

              <SectionHeader title="Experience" />
              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Total Experience (Years) *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="reg-v2-input no-icon"
                    placeholder="e.g. 10"
                    value={profileData.yearsOfExperience || ''}
                    onChange={(e) => handleDigitsOnly('yearsOfExperience', e.target.value, 2)}
                    required
                  />
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Startups Mentored (Optional)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="reg-v2-input no-icon"
                    placeholder="e.g. 5"
                    value={profileData.startupsMentored || ''}
                    onChange={(e) => handleDigitsOnly('startupsMentored', e.target.value, 3)}
                  />
                </div>
              </div>

              <SectionHeader title="Expertise" />
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Areas of Expertise (Multi-select) *</label>
                <MultiSelectPills
                  options={['Product', 'Marketing', 'Sales', 'HR', 'Technology', 'Legal', 'Finance', 'Fundraising', 'Operations']}
                  selectedValues={profileData.expertise || []}
                  onChange={(vals) => onChange('expertise', vals)}
                  placeholder="Type custom domain expertise and click + Add..."
                />
              </div>

              <SectionHeader title="Availability" />
              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Weekly Availability *</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.weeklyAvailability || ''}
                    onChange={(e) => onChange('weeklyAvailability', e.target.value)}
                    required
                  >
                    <option value="">Select availability</option>
                    <option value="1-2 hrs/week">1-2 hrs/week</option>
                    <option value="3-5 hrs/week">3-5 hrs/week</option>
                    <option value="5+ hrs/week">5+ hrs/week</option>
                  </select>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Mode of Mentorship *</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.availabilityMode || ''}
                    onChange={(e) => onChange('availabilityMode', e.target.value)}
                    required
                  >
                    <option value="">Select mode</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Both">Both Online & Offline</option>
                  </select>
                </div>
              </div>

              <SectionHeader title="About & Links" />
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Bio (Min 20 Words) *</label>
                <textarea
                  className="reg-v2-textarea no-icon"
                  rows={3}
                  placeholder="Share your career highlights and how you can support founders..."
                  value={profileData.bio || ''}
                  onChange={(e) => onChange('bio', e.target.value)}
                  required
                />
                <p style={{ fontSize: '11px', color: bioWords >= 20 ? '#059669' : '#ef4444', marginTop: '4px' }}>
                  {bioWords >= 20 ? `✓ Word count requirement met (${bioWords} words)` : `✕ Minimum 20 words required (${bioWords}/20 words)`}
                </p>
              </div>

              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">LinkedIn Profile *</label>
                  <div className="reg-v2-input-wrapper">
                    <LinkedinIcon className="reg-v2-input-icon" size={18} />
                    <input
                      type="url"
                      className="reg-v2-input"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={profileData.linkedin || ''}
                      onChange={(e) => onChange('linkedin', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Personal Website (Optional)</label>
                  <div className="reg-v2-input-wrapper">
                    <Globe className="reg-v2-input-icon" size={18} />
                    <input
                      type="url"
                      className="reg-v2-input"
                      placeholder="https://yourwebsite.com"
                      value={profileData.website || ''}
                      onChange={(e) => onChange('website', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          );
        }

      /* ==========================================
         5. INVESTOR ROLE
         ========================================== */
      case 'investor':
        return (
          <>
            <SectionHeader title="Investor Information" />
            <div className="reg-v2-form-row">
              <ImageUploadDropzone
                label="Profile / Organization Photo (Optional)"
                value={profileData.profilePhoto}
                onChange={(val) => onChange('profilePhoto', val)}
              />

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Organization Name *</label>
                <div className="reg-v2-input-wrapper">
                  <Building className="reg-v2-input-icon" size={18} />
                  <input
                    type="text"
                    className="reg-v2-input"
                    placeholder="Firm or Syndicate Name"
                    value={profileData.organizationName || ''}
                    onChange={(e) => onChange('organizationName', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="reg-v2-form-row">
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Investor Type *</label>
                <select
                  className="reg-v2-select no-icon"
                  value={profileData.investorType || ''}
                  onChange={(e) => onChange('investorType', e.target.value)}
                  required
                >
                  <option value="">Select investor type</option>
                  <option value="Angel">Angel</option>
                  <option value="VC">VC</option>
                  <option value="Family Office">Family Office</option>
                  <option value="Corporate VC">Corporate VC</option>
                </select>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Preferred Stage *</label>
                <select
                  className="reg-v2-select no-icon"
                  value={profileData.investmentStage || ''}
                  onChange={(e) => onChange('investmentStage', e.target.value)}
                  required
                >
                  <option value="">Select stage</option>
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Pre-Series A">Pre-Series A</option>
                  <option value="Series A+">Series A+</option>
                </select>
              </div>
            </div>

            <SectionHeader title="Investment Preferences" />
            <div className="reg-v2-form-row">
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Preferred Industries *</label>
                <input
                  type="text"
                  className="reg-v2-input no-icon"
                  placeholder="e.g. AI, SaaS, FinTech, DeepTech"
                  value={profileData.preferredIndustries || ''}
                  onChange={(e) => onChange('preferredIndustries', e.target.value)}
                  required
                />
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Ticket Size *</label>
                <select
                  className="reg-v2-select no-icon"
                  value={profileData.ticketSize || ''}
                  onChange={(e) => onChange('ticketSize', e.target.value)}
                  required
                >
                  <option value="">Select ticket size</option>
                  <option value="₹5L - ₹25L">₹5L - ₹25L</option>
                  <option value="₹25L - ₹1Cr">₹25L - ₹1Cr</option>
                  <option value="₹1Cr - ₹5Cr">₹1Cr - ₹5Cr</option>
                  <option value="₹5Cr+">₹5Cr+</option>
                </select>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Geography *</label>
                <select
                  className="reg-v2-select no-icon"
                  value={profileData.geography || ''}
                  onChange={(e) => onChange('geography', e.target.value)}
                  required
                >
                  <option value="">Select geography</option>
                  <option value="Pan India">Pan India</option>
                  <option value="Tier 1 Cities">Tier 1 Cities</option>
                  <option value="Global">Global</option>
                  <option value="Regional">Regional</option>
                </select>
              </div>
            </div>

            <SectionHeader title="Portfolio & Track Record" />
            <div className="reg-v2-form-row">
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Number of Investments (Optional)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="reg-v2-input no-icon"
                  placeholder="e.g. 12"
                  value={profileData.numberOfInvestments || ''}
                  onChange={(e) => handleDigitsOnly('numberOfInvestments', e.target.value, 3)}
                />
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Portfolio Website (Optional)</label>
                <div className="reg-v2-input-wrapper">
                  <Globe className="reg-v2-input-icon" size={18} />
                  <input
                    type="url"
                    className="reg-v2-input"
                    placeholder="https://portfolio.com"
                    value={profileData.portfolioWebsite || ''}
                    onChange={(e) => onChange('portfolioWebsite', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <SectionHeader title="Social & Links" />
            <div className="reg-v2-form-row">
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">LinkedIn Profile *</label>
                <div className="reg-v2-input-wrapper">
                  <LinkedinIcon className="reg-v2-input-icon" size={18} />
                  <input
                    type="url"
                    className="reg-v2-input"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={profileData.linkedin || ''}
                    onChange={(e) => onChange('linkedin', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Website (Optional)</label>
                <div className="reg-v2-input-wrapper">
                  <Globe className="reg-v2-input-icon" size={18} />
                  <input
                    type="url"
                    className="reg-v2-input"
                    placeholder="https://yourfirm.com"
                    value={profileData.website || ''}
                    onChange={(e) => onChange('website', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        );

      /* ==========================================
         6. SERVICE PROVIDER ROLE
         ========================================== */
      case 'service_provider':
        {
          const descWords = countWords(profileData.description || '');

          return (
            <>
              <SectionHeader title="Company Information" />
              <div className="reg-v2-form-row">
                <ImageUploadDropzone
                  label="Company Logo / Photo (Optional)"
                  value={profileData.profilePhoto}
                  onChange={(val) => onChange('profilePhoto', val)}
                />

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Company Name *</label>
                  <div className="reg-v2-input-wrapper">
                    <Building className="reg-v2-input-icon" size={18} />
                    <input
                      type="text"
                      className="reg-v2-input"
                      placeholder="Enter company / firm name"
                      value={profileData.companyName || ''}
                      onChange={(e) => onChange('companyName', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Service Category *</label>
                  <select
                    className="reg-v2-select no-icon"
                    value={profileData.serviceCategory || ''}
                    onChange={(e) => onChange('serviceCategory', e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Legal">Legal</option>
                    <option value="CA">CA / Tax</option>
                    <option value="Branding">Branding</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                    <option value="Recruitment">Recruitment</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Patent">Patent</option>
                    <option value="Trademark">Trademark</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {profileData.serviceCategory === 'Other' && (
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Custom Service Category *</label>
                  <input
                    type="text"
                    className="reg-v2-input no-icon"
                    placeholder="Specify your custom service category..."
                    value={profileData.customServiceCategory || ''}
                    onChange={(e) => onChange('customServiceCategory', e.target.value)}
                    required
                  />
                </div>
              )}

              <SectionHeader title="Business Details" />
              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Years in Business *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="reg-v2-input no-icon"
                    placeholder="e.g. 5"
                    value={profileData.yearsInBusiness || ''}
                    onChange={(e) => handleDigitsOnly('yearsInBusiness', e.target.value, 2)}
                    required
                  />
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Company Website (Optional)</label>
                  <div className="reg-v2-input-wrapper">
                    <Globe className="reg-v2-input-icon" size={18} />
                    <input
                      type="url"
                      className="reg-v2-input"
                      placeholder="https://yourfirm.com"
                      value={profileData.website || ''}
                      onChange={(e) => onChange('website', e.target.value)}
                    />
                  </div>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">City *</label>
                  <div className="reg-v2-input-wrapper">
                    <MapPin className="reg-v2-input-icon" size={18} />
                    <input
                      type="text"
                      className="reg-v2-input"
                      placeholder="Enter city"
                      value={profileData.city || ''}
                      onChange={(e) => onChange('city', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <SectionHeader title="Services Offered" />
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Services Offered (Multi-select) *</label>
                <MultiSelectPills
                  options={[
                    'Legal Compliance', 
                    'CA / Taxation', 
                    'Branding & UI/UX', 
                    'Software Development', 
                    'Digital Marketing', 
                    'HR / Recruitment', 
                    'Patent / Trademark'
                  ]}
                  selectedValues={profileData.servicesOffered || []}
                  onChange={(vals) => onChange('servicesOffered', vals)}
                  placeholder="Type custom service and click + Add..."
                />
              </div>

              <SectionHeader title="About Company" />
              <div className="reg-v2-field-group">
                <label className="reg-v2-label">Short Description (Min 20 Words) *</label>
                <textarea
                  className="reg-v2-textarea no-icon"
                  rows={3}
                  placeholder="Describe your company services, track record, and special packages for startups..."
                  value={profileData.description || ''}
                  onChange={(e) => onChange('description', e.target.value)}
                  required
                />
                <p style={{ fontSize: '11px', color: descWords >= 20 ? '#059669' : '#ef4444', marginTop: '4px' }}>
                  {descWords >= 20 ? `✓ Word count requirement met (${descWords} words)` : `✕ Minimum 20 words required (${descWords}/20 words)`}
                </p>
              </div>

              <SectionHeader title="Social & Links" />
              <div className="reg-v2-form-row">
                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">LinkedIn Profile (Optional)</label>
                  <div className="reg-v2-input-wrapper">
                    <LinkedinIcon className="reg-v2-input-icon" size={18} />
                    <input
                      type="url"
                      className="reg-v2-input"
                      placeholder="https://linkedin.com/company/yourfirm"
                      value={profileData.linkedin || ''}
                      onChange={(e) => onChange('linkedin', e.target.value)}
                    />
                  </div>
                </div>

                <div className="reg-v2-field-group">
                  <label className="reg-v2-label">Website (Optional)</label>
                  <div className="reg-v2-input-wrapper">
                    <Globe className="reg-v2-input-icon" size={18} />
                    <input
                      type="url"
                      className="reg-v2-input"
                      placeholder="https://yourfirm.com"
                      value={profileData.website || ''}
                      onChange={(e) => onChange('website', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          );
        }

      default:
        return (
          <div className="reg-v2-field-group">
            <label className="reg-v2-label">Brief Bio / Details *</label>
            <textarea
              className="reg-v2-textarea no-icon"
              rows={4}
              placeholder="Tell us a little bit about yourself..."
              value={profileData.bio || ''}
              onChange={(e) => onChange('bio', e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div>
      <div className="reg-v2-content-header">
        <h2 className="reg-v2-content-title">Profile <span>Setup</span></h2>
        <p className="reg-v2-content-subtitle">
          Please provide additional details for your <strong>{getRoleTitle(role)}</strong> profile.
        </p>
      </div>

      <div className="reg-v2-role-pill">
        <span>Selected Role:</span>
        <strong style={{ color: '#dc2626' }}>{getRoleTitle(role)}</strong>
      </div>

      <div className="reg-v2-step4-layout">
        <div className="reg-v2-form" style={{ maxWidth: '100%' }}>
          {renderFormFields()}
        </div>

        <div className="reg-v2-helper-card">
          <div className="reg-v2-helper-title">Why do we need this?</div>
          <div className="reg-v2-helper-list">
            <div className="reg-v2-helper-item">✓ Tailored dashboard & feed</div>
            <div className="reg-v2-helper-item">✓ Role-specific opportunities</div>
            <div className="reg-v2-helper-item">✓ Higher authority review</div>
            <div className="reg-v2-helper-item">✓ Verified ecosystem access</div>
          </div>
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #fecaca', fontSize: '11px', color: '#7f1d1d' }}>
            <HelpCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Need help? Contact support@startupsindia.in
          </div>
        </div>
      </div>
    </div>
  );
}

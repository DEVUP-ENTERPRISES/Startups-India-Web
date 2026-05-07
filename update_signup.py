import re

with open("apps/web/app/login/page.js", "r", encoding="utf-8") as f:
    login_content = f.read()

with open("apps/web/app/signup/page.js", "r", encoding="utf-8") as f:
    signup_content = f.read()

cards_match = re.search(r"const dashboardCards = \[.*?\];", login_content, re.DOTALL)
dashboard_cards = cards_match.group(0) if cards_match else ""

panel_match = re.search(r'(<div className="dashboard-panel">.*?</div>\n      </div>)', login_content, re.DOTALL)
dashboard_panel = panel_match.group(1).replace('"dashboard-panel"', '"dashboard-panel right-panel"') if panel_match else ""

state_match = re.search(r"(import .*?\nfunction SignupContent\(\) \{.*?)  return \(", signup_content, re.DOTALL)
signup_state = state_match.group(1) if state_match else ""
signup_state = signup_state.replace("import '@/styles/signup.css';", "import '@/styles/auth-redesign.css';\nimport { Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck, CheckCircle2, Users, Briefcase, Target, TrendingUp, Award, Zap } from 'lucide-react';\nimport { motion, AnimatePresence } from 'framer-motion';")
signup_state = signup_state.replace("const [currentSlide, setCurrentSlide] = useState(0);", "const [isSwitching, setIsSwitching] = useState(false);\n  const handleNavigation = (e, path) => {\n    e.preventDefault();\n    setIsSwitching(true);\n    setTimeout(() => { router.push(path); }, 500);\n  };\n")

new_return = f"""
  {dashboard_cards}

  return (
    <div className={{`auth-layout signup-mode ${{isSwitching ? 'auth-switching' : ''}}`}}>
      {{/* Left Panel - Auth Form */}}
      <div className="auth-panel left-panel">
        <motion.div 
          initial={{{{ opacity: 0, scale: 0.95 }}}}
          animate={{{{ opacity: 1, scale: 1 }}}}
          transition={{{{ duration: 0.5 }}}}
          className="auth-card"
        >
          {{/* Abstract Illustration Background */}}
          <div className="auth-illustration">
            <svg className="rocket-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
            </svg>
            <div className="building-silhouette building-1"></div>
            <div className="building-silhouette building-2"></div>
            <div className="building-silhouette building-3"></div>
          </div>

          <AnimatePresence mode="wait">
            {{success ? (
              <motion.div 
                key="success"
                initial={{{{ opacity: 0, y: 20 }}}}
                animate={{{{ opacity: 1, y: 0 }}}}
                exit={{{{ opacity: 0, y: -20 }}}}
                className="success-view"
                style={{{{ textAlign: 'center', padding: '40px 0' }}}}
              >
                <div style={{{{ marginBottom: '24px', color: '#10b981' }}}}>
                  <CheckCircle2 size={{80}} style={{{{ margin: '0 auto' }}}} />
                </div>
                <h2 className="auth-title">Welcome <span>Aboard</span></h2>
                <p className="auth-subtitle">Redirecting to your dashboard...</p>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="auth-header">
                  <div className="startup-badge">
                    Startup India Incubation
                  </div>
                  <h2 className="auth-title">Create Your <span>Account</span></h2>
                  <p className="auth-subtitle">
                    Join thousands of successful entrepreneurs and get access to exclusive mentorship and funding.
                  </p>
                </div>

                {{error && (
                  <motion.div 
                    initial={{{{ opacity: 0, y: -10 }}}}
                    animate={{{{ opacity: 1, y: 0 }}}}
                    style={{{{ 
                      padding: '12px 16px', background: '#fef2f2', border: '1px solid #fee2e2', 
                      borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 500,
                      marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'
                    }}}}
                  >
                    <ShieldCheck size={{16}} />
                    {{error}}
                  </motion.div>
                )}}

                <form onSubmit={{handleSubmit}}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon-left" size={{18}} />
                      <input 
                        type="text" 
                        className="auth-input"
                        placeholder="John Doe"
                        value={{fullName}}
                        onChange={{(e) => setFullName(e.target.value)}}
                        required
                        disabled={{isLoading}}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon-left" size={{18}} />
                      <input 
                        type="email" 
                        className="auth-input"
                        placeholder="you@example.com"
                        value={{email}}
                        onChange={{(e) => setEmail(e.target.value)}}
                        required
                        disabled={{isLoading}}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon-left" size={{18}} />
                      <input 
                        type={{showPassword ? "text" : "password"}} 
                        className="auth-input"
                        placeholder="Create a strong password"
                        value={{password}}
                        onChange={{(e) => setPassword(e.target.value)}}
                        onFocus={{() => setPasswordFocused(true)}}
                        onBlur={{() => setPasswordFocused(false)}}
                        required
                        disabled={{isLoading}}
                      />
                      <button 
                        type="button" 
                        className="password-toggle-btn"
                        onClick={{() => setShowPassword(!showPassword)}}
                      >
                        {{showPassword ? <EyeOff size={{16}} /> : <Eye size={{16}} />}}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon-left" size={{18}} />
                      <input 
                        type={{showConfirmPassword ? "text" : "password"}} 
                        className="auth-input"
                        placeholder="Confirm your password"
                        value={{confirmPassword}}
                        onChange={{(e) => setConfirmPassword(e.target.value)}}
                        required
                        disabled={{isLoading}}
                      />
                      <button 
                        type="button" 
                        className="password-toggle-btn"
                        onClick={{() => setShowConfirmPassword(!showConfirmPassword)}}
                      >
                        {{showConfirmPassword ? <EyeOff size={{16}} /> : <Eye size={{16}} />}}
                      </button>
                    </div>
                  </div>

                  <div className="form-group remember-me-group">
                    <input type="checkbox" id="termsAccepted" className="custom-checkbox" checked={{termsAccepted}} onChange={{(e) => setTermsAccepted(e.target.checked)}} required />
                    <label htmlFor="termsAccepted">I agree to the Terms & Conditions</label>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={{isLoading || !termsAccepted}}
                  >
                    {{isLoading ? "Creating Account..." : "Create Account"}}
                    {{!isLoading && <ArrowRight size={{18}} />}}
                  </button>
                </form>

                <div className="divider-container">
                  <div className="divider-line"></div>
                  <span className="divider-text">OR CONTINUE WITH</span>
                  <div className="divider-line"></div>
                </div>

                <div ref={{googleBtnRef}} className="google-container"></div>

                <div className="signup-footer">
                  <p>Already have an account? <a href="/login" onClick={{(e) => handleNavigation(e, '/login')}} className="signup-action">Sign in</a></p>
                </div>
              </motion.div>
            )}}
          </AnimatePresence>
        </motion.div>
      </div>

      {{/* Right Panel - Visuals */}}
      {dashboard_panel}
    </div>
  );
}}

export default function SignupPage() {{
  return (
    <Suspense fallback={{<div style={{{{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}}}>Loading...</div>}}>
      <SignupContent />
    </Suspense>
  );
}}
"""

with open("apps/web/app/signup/page.js", "w", encoding="utf-8") as f:
    f.write("'use client';\n" + signup_state + new_return)

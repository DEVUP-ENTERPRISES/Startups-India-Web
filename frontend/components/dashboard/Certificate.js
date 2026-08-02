'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

export default function Certificate({ certificateData, onClose }) {
  const certificateRef = useRef(null);

  const handleDownload = async () => {
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          width: 1200,
          height: 850
        });
        
        const link = document.createElement('a');
        link.download = `${certificateData.certificate_number}_Certificate.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error generating certificate:', error);
        alert('Failed to download certificate. Please try again.');
      }
    }
  };

  const handleShare = (platform) => {
    const text = `I've successfully completed the ${certificateData.course_title}! 🎓`;
    const url = window.location.origin + '/verify/' + certificateData.certificate_number;
    
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        maxWidth: '1250px',
        width: '100%',
        maxHeight: '95vh',
        overflow: 'auto',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 32px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fafafa'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
              Course Completion Certificate
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Certificate No: {certificateData.certificate_number}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px 8px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Certificate */}
        <div style={{ padding: '32px', display: 'flex', justifyContent: 'center' }}>
          <div
            ref={certificateRef}
            style={{
              width: '1200px',
              height: '850px',
              background: '#ffffff',
              border: '16px solid #1a1a1a',
              borderRadius: '0px',
              padding: '60px 80px',
              position: 'relative',
              boxShadow: 'inset 0 0 0 2px #DC143C, inset 0 0 0 6px #ffffff, inset 0 0 0 8px #1a1a1a, 0 20px 40px rgba(0,0,0,0.15)'
            }}
          >
            {/* Decorative Red Accent Lines */}
            <div style={{
              position: 'absolute',
              top: '50px',
              left: '50px',
              width: '120px',
              height: '4px',
              background: 'linear-gradient(90deg, #DC143C 0%, #8B0000 100%)'
            }} />
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '50px',
              width: '120px',
              height: '4px',
              background: 'linear-gradient(90deg, #8B0000 0%, #DC143C 100%)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '50px',
              left: '50px',
              width: '120px',
              height: '4px',
              background: 'linear-gradient(90deg, #DC143C 0%, #8B0000 100%)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '50px',
              right: '50px',
              width: '120px',
              height: '4px',
              background: 'linear-gradient(90deg, #8B0000 0%, #DC143C 100%)'
            }} />

            {/* Logo / Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '6px',
                letterSpacing: '0.02em'
              }}>
                STARTUP INDIA
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1a1a1a',
                letterSpacing: '0.25em'
              }}>
                INCUBATION PROGRAM
              </div>
            </div>

            {/* Certificate Title */}
            <div style={{ textAlign: 'center', marginBottom: '38px' }}>
              <div style={{
                fontSize: '44px',
                fontWeight: '400',
                color: '#1a1a1a',
                fontFamily: 'serif',
                letterSpacing: '0.08em',
                marginBottom: '14px'
              }}>
                Certificate of Completion
              </div>
              <div style={{
                width: '250px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #DC143C, #8B0000, #DC143C, transparent)',
                margin: '0 auto'
              }} />
            </div>

            {/* Recipient */}
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <div style={{
                fontSize: '15px',
                color: '#6b7280',
                marginBottom: '10px',
                fontWeight: '500'
              }}>
                This is to certify that
              </div>
              <div style={{
                fontSize: '40px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '10px',
                fontFamily: 'serif',
                padding: '10px 40px',
                borderBottom: '3px solid #DC143C',
                display: 'inline-block'
              }}>
                {certificateData.user_name}
              </div>
              <div style={{
                fontSize: '15px',
                color: '#6b7280',
                lineHeight: '1.6',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                has successfully completed the comprehensive
              </div>
            </div>

            {/* Course Info */}
            <div style={{
              textAlign: 'center',
              background: 'rgba(220, 20, 60, 0.03)',
              border: '2px solid #DC143C',
              borderRadius: '0px',
              padding: '24px 32px',
              marginBottom: '30px',
              position: 'relative'
            }}>
              <div style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '14px'
              }}>
                {certificateData.course_title}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '40px',
                fontSize: '13px',
                color: '#6b7280'
              }}>
                <div>
                  <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
                    {certificateData.total_lessons_completed}
                  </span> Lessons Completed
                </div>
                <div>
                  <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
                    {certificateData.total_quizzes_passed}
                  </span> Quizzes Passed
                </div>
              </div>
            </div>

            {/* Completion Date */}
            <div style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '35px'
            }}>
              Completed on <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
                {new Date(certificateData.completion_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {/* Signatures */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '100px',
              marginTop: '30px',
              paddingLeft: '60px',
              paddingRight: '60px',
              marginBottom: '60px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'cursive',
                  fontSize: '24px',
                  color: '#1a1a1a',
                  marginBottom: '10px',
                  fontWeight: '600'
                }}>
                  Dr. Rajesh Kumar
                </div>
                <div style={{
                  width: '200px',
                  height: '2px',
                  background: '#DC143C',
                  margin: '0 auto 8px auto'
                }} />
                <div style={{
                  fontSize: '12px',
                  color: '#1a1a1a',
                  fontWeight: '700',
                  marginBottom: '3px'
                }}>
                  Program Director
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Startup India Initiative
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'cursive',
                  fontSize: '24px',
                  color: '#1a1a1a',
                  marginBottom: '10px',
                  fontWeight: '600'
                }}>
                  Priya Sharma
                </div>
                <div style={{
                  width: '200px',
                  height: '2px',
                  background: '#DC143C',
                  margin: '0 auto 8px auto'
                }} />
                <div style={{
                  fontSize: '12px',
                  color: '#1a1a1a',
                  fontWeight: '700',
                  marginBottom: '3px'
                }}>
                  Chief Executive Officer
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Incubation Center
                </div>
              </div>
            </div>

            {/* Certificate Number & Date at Bottom */}
            <div style={{
              position: 'absolute',
              bottom: '25px',
              left: '80px',
              right: '80px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#9ca3af',
              fontWeight: '500'
            }}>
              <div>Certificate No: {certificateData.certificate_number}</div>
              <div>Issued: {new Date(certificateData.issued_date).toLocaleDateString('en-US')}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fafafa'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleShare('linkedin')}
              style={{
                padding: '10px 20px',
                background: '#0077b5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              LinkedIn
            </button>
            <button
              onClick={() => handleShare('twitter')}
              style={{
                padding: '10px 20px',
                background: '#1da1f2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.54-2.12-9.91-5.04-.42.72-.66 1.55-.66 2.44 0 1.67.85 3.14 2.14 4-.79-.03-1.53-.24-2.18-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.94 2.42 3.35 4.55 3.39-1.67 1.31-3.77 2.09-6.05 2.09-.39 0-.78-.02-1.17-.07 2.18 1.4 4.77 2.21 7.55 2.21 9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.42-.02-.63.96-.69 1.8-1.56 2.46-2.55z"/>
              </svg>
              Twitter
            </button>
            <button
              onClick={() => handleShare('facebook')}
              style={{
                padding: '10px 20px',
                background: '#1877f2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
              </svg>
              Facebook
            </button>
          </div>

          <button
            onClick={handleDownload}
            style={{
              padding: '12px 36px',
              background: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              boxShadow: '0 4px 16px rgba(220, 20, 60, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 20, 60, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(220, 20, 60, 0.4)';
            }}
          >
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
}

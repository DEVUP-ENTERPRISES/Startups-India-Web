'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function CertificateCard({ certificate, userName, courseName }) {
  const canvasRef = useRef(null);

  const drawCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 20;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Inner border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', width / 2, 120);

    // Subtitle
    ctx.font = '24px serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('This is to certify that', width / 2, 180);

    // User name
    ctx.font = 'bold 40px serif';
    ctx.fillStyle = '#2563eb';
    ctx.fillText(userName || 'Student Name', width / 2, 240);

    // Course completion text
    ctx.font = '24px serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('has successfully completed the course', width / 2, 290);

    // Course name
    ctx.font = 'bold 32px serif';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(courseName || 'Course Name', width / 2, 340);

    // Date
    const issueDate = certificate?.issued_date
      ? new Date(certificate.issued_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

    ctx.font = '20px serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`Issued on ${issueDate}`, width / 2, 400);

    // Signature line
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 150, 480);
    ctx.lineTo(width / 2 + 150, 480);
    ctx.stroke();

    // Signature text
    ctx.font = '18px serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Authorized Signature', width / 2, 510);

    // Certificate ID
    if (certificate?.id) {
      ctx.font = '14px monospace';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(`Certificate ID: ${certificate.id.substring(0, 16)}`, width / 2, 550);
    }
  }, [certificate, userName, courseName]);

  useEffect(() => {
    if (canvasRef.current) {
      drawCertificate();
    }
  }, [drawCertificate]);

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `certificate-${courseName?.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="certificate-card">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          width: '100%',
          maxWidth: '800px',
          height: 'auto',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
        }}
      />
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <button onClick={downloadCertificate} className="btn btn-primary">
          Download Certificate
        </button>
      </div>
    </div>
  );
}

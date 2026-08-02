'use client';

import { useState } from 'react';

export default function AssignmentForm({ videoId, onSubmit, isSubmitting, existingAssignment }) {
  const [reflection, setReflection] = useState(existingAssignment?.reflection_text || '');
  const [error, setError] = useState('');

  const wordCount = reflection.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minWords = 150;
  const isValid = wordCount >= minWords;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValid) {
      setError(`Please write at least ${minWords} words. Current: ${wordCount} words.`);
      return;
    }

    if (onSubmit) {
      await onSubmit(reflection);
    }
  };

  if (existingAssignment) {
    return (
      <div className="assignment-submitted">
        <div className="alert alert-success">
          <strong>✓ Assignment Submitted</strong>
          <p>You have already submitted your reflection for this lesson.</p>
        </div>
        <div className="form-group">
          <label className="form-label">Your Reflection:</label>
          <div className="submitted-text">
            {existingAssignment.reflection_text}
          </div>
          <div className="text-secondary" style={{ fontSize: '14px', marginTop: '8px' }}>
            Submitted on: {new Date(existingAssignment.submitted_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="assignment-form">
      <div className="form-group">
        <label className="form-label">
          Write your reflection (minimum {minWords} words)
        </label>
        <textarea
          className="form-textarea"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Share your key learnings, insights, and how you plan to apply this knowledge..."
          rows={8}
          disabled={isSubmitting}
        />
        <div className={`character-count ${!isValid && wordCount > 0 ? 'error' : ''}`}>
          {wordCount} / {minWords} words
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
      </button>
    </form>
  );
}

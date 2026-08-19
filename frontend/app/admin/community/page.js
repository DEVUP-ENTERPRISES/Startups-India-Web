'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  getGroups,
} from '@/lib/community';
import { apiFetch } from '@/lib/api';
import '@/styles/admin-panel.css';

export default function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState('channels'); // 'channels' | 'groups'
  const [channels, setChannels] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Channel Modal State
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const [submittingChannel, setSubmittingChannel] = useState(false);
  const [channelFormData, setChannelFormData] = useState({
    name: '',
    description: '',
    type: 'open',
    targetAudience: 'all',
    icon: 'feed',
  });

  // Group Modal State
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [submittingGroup, setSubmittingGroup] = useState(false);
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    description: '',
    privacy: 'public', // 'public' | 'admin-only'
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'channels') {
        const res = await getChannels();
        if (res?.data) setChannels(res.data);
      } else {
        const res = await getGroups();
        if (res?.data) setGroups(res.data);
      }
    } catch (err) {
      console.error('Error loading admin community data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Channel Handlers
  const handleOpenChannelModal = (channel = null) => {
    if (channel) {
      setEditingChannel(channel);
      setChannelFormData({
        name: channel.name,
        description: channel.description || '',
        type: channel.type || 'open',
        targetAudience: channel.targetAudience || 'all',
        icon: channel.icon || 'feed',
      });
    } else {
      setEditingChannel(null);
      setChannelFormData({
        name: '',
        description: '',
        type: 'open',
        targetAudience: 'all',
        icon: 'feed',
      });
    }
    setChannelModalOpen(true);
  };

  const handleSaveChannel = async (e) => {
    e.preventDefault();
    setSubmittingChannel(true);
    try {
      if (editingChannel) {
        await updateChannel(editingChannel._id, channelFormData);
      } else {
        await createChannel(channelFormData);
      }
      setChannelModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save channel');
    } finally {
      setSubmittingChannel(false);
    }
  };

  const handleDeleteChannel = async (id) => {
    if (!confirm('Are you sure you want to delete this channel?')) return;
    try {
      await deleteChannel(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete channel');
    }
  };

  // Group Handlers
  const handleSaveGroup = async (e) => {
    e.preventDefault();
    setSubmittingGroup(true);
    try {
      const res = await apiFetch('/api/v1/community/groups', {
        method: 'POST',
        body: JSON.stringify(groupFormData),
      });
      if (res?.error) throw new Error(res.error.message);
      setGroupModalOpen(false);
      setGroupFormData({ name: '', description: '', privacy: 'public' });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create group');
    } finally {
      setSubmittingGroup(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    try {
      const res = await apiFetch(`/api/v1/community/groups/${groupId}`, {
        method: 'DELETE',
      });
      if (res?.error) throw new Error(res.error.message);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete group');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111', margin: 0 }}>Community Management</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>
            Manage discussion channels, target audiences, and WhatsApp groups for members.
          </p>
        </div>

        {activeTab === 'channels' ? (
          <button
            onClick={() => handleOpenChannelModal()}
            style={{
              background: '#7A1F2B',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            + Create Channel
          </button>
        ) : (
          <button
            onClick={() => setGroupModalOpen(true)}
            style={{
              background: '#7A1F2B',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            + Create Group
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
        <button
          onClick={() => setActiveTab('channels')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'transparent',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            borderBottom: activeTab === 'channels' ? '3px solid #7A1F2B' : '3px solid transparent',
            color: activeTab === 'channels' ? '#7A1F2B' : '#64748b',
          }}
        >
          Discussion Channels
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'transparent',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            borderBottom: activeTab === 'groups' ? '3px solid #7A1F2B' : '3px solid transparent',
            color: activeTab === 'groups' ? '#7A1F2B' : '#64748b',
          }}
        >
          Groups
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading data...</div>
      ) : activeTab === 'channels' ? (
        /* CHANNELS TABLE */
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '14px 20px' }}>Channel Name</th>
                <th style={{ padding: '14px 20px' }}>Slug</th>
                <th style={{ padding: '14px 20px' }}>Visible To (Audience)</th>
                <th style={{ padding: '14px 20px' }}>Posting Rights</th>
                <th style={{ padding: '14px 20px' }}>Post Count</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((ch) => (
                <tr key={ch._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#111' }}>
                    # {ch.name}
                    {ch.description && (
                      <div style={{ fontSize: '12px', fontWeight: 400, color: '#64748b', marginTop: '2px' }}>
                        {ch.description}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#64748b', fontFamily: 'monospace' }}>{ch.slug}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '99px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background:
                          ch.targetAudience === 'founders'
                            ? '#FFF0F0'
                            : ch.targetAudience === 'investors'
                            ? '#FEF3C7'
                            : ch.targetAudience === 'students'
                            ? '#EFF6FF'
                            : '#F1F5F9',
                        color:
                          ch.targetAudience === 'founders'
                            ? '#7A1F2B'
                            : ch.targetAudience === 'investors'
                            ? '#92400E'
                            : ch.targetAudience === 'students'
                            ? '#1E40AF'
                            : '#475569',
                      }}
                    >
                      {ch.targetAudience === 'founders'
                        ? 'Founders Only'
                        : ch.targetAudience === 'investors'
                        ? 'Investors Only'
                        : ch.targetAudience === 'students'
                        ? 'Students Only'
                        : ch.targetAudience === 'mentors'
                        ? 'Mentors Only'
                        : 'Everyone'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '99px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background:
                          ch.type === 'announce'
                            ? '#FEF2F2'
                            : ch.type === 'restricted'
                            ? '#FFFBEB'
                            : '#F0FDF4',
                        color:
                          ch.type === 'announce'
                            ? '#7A1F2B'
                            : ch.type === 'restricted'
                            ? '#B45309'
                            : '#15803D',
                      }}
                    >
                      {ch.type === 'announce'
                        ? 'Admin Only'
                        : ch.type === 'restricted'
                        ? 'Founders & Admins'
                        : 'Open to All'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#64748b' }}>{ch.postCount || 0}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenChannelModal(ch)}
                      style={{
                        background: '#f1f5f9',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        marginRight: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '12px',
                        color: '#334155',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteChannel(ch._id)}
                      style={{
                        background: '#fef2f2',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '12px',
                        color: '#7A1F2B',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* GROUPS TABLE */
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '14px 20px' }}>Group Name</th>
                <th style={{ padding: '14px 20px' }}>Description</th>
                <th style={{ padding: '14px 20px' }}>Chat Permission</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#111' }}>
                    💬 {g.name}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#64748b' }}>{g.description || 'No description'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '99px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: g.privacy === 'admin-only' ? '#FEF2F2' : '#F0FDF4',
                        color: g.privacy === 'admin-only' ? '#7A1F2B' : '#16A34A',
                      }}
                    >
                      {g.privacy === 'admin-only' ? 'Admin Only Chat' : 'Open to All Members'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteGroup(g._id)}
                      style={{
                        background: '#fef2f2',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '12px',
                        color: '#7A1F2B',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                    No groups created yet. Click "+ Create Group" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Channel Modal */}
      {channelModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 20px', color: '#111' }}>
              {editingChannel ? 'Edit Discussion Channel' : 'Create New Discussion Channel'}
            </h2>
            <form onSubmit={handleSaveChannel}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Channel Name
                </label>
                <input
                  type="text"
                  required
                  value={channelFormData.name}
                  onChange={(e) => setChannelFormData({ ...channelFormData, name: e.target.value })}
                  placeholder="e.g. Incubation Cohort, Founders Lounge"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={channelFormData.description}
                  onChange={(e) => setChannelFormData({ ...channelFormData, description: e.target.value })}
                  placeholder="Short explanation of what gets posted here..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Target Audience (Who can see this channel in their sidebar?)
                </label>
                <select
                  value={channelFormData.targetAudience}
                  onChange={(e) => setChannelFormData({ ...channelFormData, targetAudience: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    background: '#fff',
                  }}
                >
                  <option value="all">Everyone (Public to all community members)</option>
                  <option value="founders">Founders Only (Founders & Co-founders & Admins)</option>
                  <option value="students">Students Only (Students & Admins)</option>
                  <option value="investors">Investors Only (Investors & Admins)</option>
                  <option value="mentors">Mentors Only (Mentors & Admins)</option>
                </select>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Users outside this role will NOT see this channel in their sidebar.
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Posting Permission (Who can write posts here?)
                </label>
                <select
                  value={channelFormData.type}
                  onChange={(e) => setChannelFormData({ ...channelFormData, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    background: '#fff',
                  }}
                >
                  <option value="open">Open — Anyone who can view this channel can write posts</option>
                  <option value="restricted">Restricted — Only Founders & Admins can write posts</option>
                  <option value="announce">Announcements — Only Admins can write posts</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setChannelModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingChannel}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#7A1F2B',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {submittingChannel ? 'Saving...' : 'Save Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Group Modal */}
      {groupModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 20px', color: '#111' }}>
              Create WhatsApp Group
            </h2>
            <form onSubmit={handleSaveGroup}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={groupFormData.name}
                  onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                  placeholder="e.g. SaaS Pioneers, Cohort #4 Official"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={groupFormData.description}
                  onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
                  placeholder="Brief description of the group chat..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Chat Permission
                </label>
                <select
                  value={groupFormData.privacy}
                  onChange={(e) => setGroupFormData({ ...groupFormData, privacy: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    background: '#fff',
                  }}
                >
                  <option value="public">Open to All Members (Everyone can send messages)</option>
                  <option value="admin-only">Admin Only Chat (Only Admins can send messages)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setGroupModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGroup}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#7A1F2B',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {submittingGroup ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

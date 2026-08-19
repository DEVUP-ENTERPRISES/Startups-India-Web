import { apiFetch } from './api';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000';

/**
 * Fetch all active community channels
 */
export async function getChannels() {
  return apiFetch('/api/v1/community/channels');
}

/**
 * Create a new channel (Admin only)
 */
export async function createChannel(data) {
  return apiFetch('/api/v1/community/channels', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a channel (Admin only)
 */
export async function updateChannel(id, data) {
  return apiFetch(`/api/v1/community/channels/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a channel (Admin only)
 */
export async function deleteChannel(id) {
  return apiFetch(`/api/v1/community/channels/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Fetch posts for a given channel or 'all'
 */
export async function getPosts(channelId = 'all', cursor = null) {
  let path = `/api/v1/community/posts?channelId=${channelId}`;
  if (cursor) path += `&cursor=${cursor}`;
  return apiFetch(path);
}

/**
 * Create a new post
 */
export async function createPost(data) {
  return apiFetch('/api/v1/community/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a post
 */
export async function deletePost(id) {
  return apiFetch(`/api/v1/community/posts/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Toggle like on a post
 */
export async function toggleLike(id) {
  return apiFetch(`/api/v1/community/posts/${id}/like`, {
    method: 'POST',
  });
}

/**
 * Fetch comments for a post
 */
export async function getComments(postId) {
  return apiFetch(`/api/v1/community/posts/${postId}/comments`);
}

/**
 * Add a comment to a post
 */
export async function addComment(postId, body) {
  return apiFetch(`/api/v1/community/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

/**
 * Vote on a poll option
 */
export async function votePoll(postId, optionId) {
  return apiFetch(`/api/v1/community/posts/${postId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ optionId }),
  });
}

/**
 * Upload post image to S3
 */
export async function uploadPostImage(file) {
  const { data: presignedData, error: presignedErr } = await apiFetch('/api/v1/community/upload-image', {
    method: 'POST',
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }),
  });

  if (presignedErr || !presignedData) {
    throw new Error(presignedErr?.message || 'Failed to get upload URL');
  }

  const { uploadUrl, publicUrl, key } = presignedData;

  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image to S3');
  }

  return { key, publicUrl };
}

// ─── WhatsApp Groups API ──────────────────────────────────────────────────────
export async function getGroups() {
  return apiFetch('/api/v1/community/groups');
}

export async function getGroupMessages(groupId) {
  return apiFetch(`/api/v1/community/groups/${groupId}/messages`);
}

export async function sendGroupMessage(groupId, content) {
  return apiFetch(`/api/v1/community/groups/${groupId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

// ─── Doubts / Q&A Hub API ─────────────────────────────────────────────────────
export async function getQuestions(filter = 'all') {
  let path = '/api/v1/community/questions';
  if (filter && filter !== 'all') path += `?status=${filter}`;
  return apiFetch(path);
}

export async function createQuestion(data) {
  return apiFetch('/api/v1/community/questions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getQuestionDetails(id) {
  return apiFetch(`/api/v1/community/questions/${id}`);
}

export async function voteQuestion(id, delta = 1) {
  return apiFetch(`/api/v1/community/questions/${id}/vote`, {
    method: 'POST',
    body: JSON.stringify({ delta }),
  });
}

export async function submitAnswer(questionId, content) {
  return apiFetch(`/api/v1/community/questions/${questionId}/answer`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

/**
 * Create SSE connection for live updates
 */
export function connectCommunitySSE(channels = 'all', onMessage) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!token) return null;

  const url = `${API_BASE}/api/v1/community/sse?channels=${channels}&token=${token}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onMessage) onMessage(data);
    } catch {
      // ignore
    }
  };

  return eventSource;
}

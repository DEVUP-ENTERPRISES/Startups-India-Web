/* ─── SSE Manager ────────────────────────────────────────────────────────────
   Maintains a registry of active SSE connections keyed by userId.
   When a new post/comment is created, call broadcast(channelId, payload) to
   push the event to all connected clients watching that channel.
   ─────────────────────────────────────────────────────────────────────────── */

// Map<userId, { res, channels: Set<channelId> }>
const clients = new Map();

/**
 * Register a new SSE connection.
 * @param {string} userId
 * @param {string[]} channelIds  – channels the client wants to watch
 * @param {Response} res         – Express response object (kept open)
 */
function addClient(userId, channelIds, res) {
  clients.set(userId, { res, channels: new Set(channelIds) });
}

/**
 * Remove a client when their connection closes.
 * @param {string} userId
 */
function removeClient(userId) {
  clients.delete(userId);
}

/**
 * Push an event to all clients subscribed to a channel.
 * @param {string} channelId
 * @param {'new_post'|'new_comment'|'like'|'channel_update'} event
 * @param {object} payload
 */
function broadcast(channelId, event, payload) {
  const data = JSON.stringify({ event, channelId, payload, ts: Date.now() });
  for (const [, client] of clients) {
    if (client.channels.has(String(channelId)) || client.channels.has('*')) {
      try {
        client.res.write(`data: ${data}\n\n`);
      } catch {
        // Connection already closed — will be cleaned up on close event
      }
    }
  }
}

/**
 * Express route handler for GET /api/v1/community/sse
 * Query params:
 *   channels  – comma-separated channel IDs to subscribe to (or 'all')
 */
function sseHandler(req, res) {
  const userId = String(req.user.userId);
  const raw = req.query.channels || 'all';
  const channelIds = raw === 'all' ? ['*'] : raw.split(',').map(s => s.trim()).filter(Boolean);

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
  res.flushHeaders();

  // Send a heartbeat immediately so the browser doesn't time out
  res.write(`: connected\n\n`);

  addClient(userId, channelIds, res);

  // Keep-alive ping every 25 s
  const pingInterval = setInterval(() => {
    try {
      res.write(`: ping\n\n`);
    } catch {
      clearInterval(pingInterval);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(pingInterval);
    removeClient(userId);
  });
}

module.exports = { sseHandler, broadcast };

const mongoose = require('mongoose');

// ─── Channel ─────────────────────────────────────────────────────────────────
// Channels are created/managed by admins only.
// type:
//   'open'       → any user with viewing access can post
//   'restricted' → only founders/co-founders/admins can post
//   'announce'   → only admins can post (read-only for everyone else)
// targetAudience:
//   'all'        → visible to everyone
//   'founders'   → visible to founders, co-founders & admins
//   'students'   → visible to students & admins
//   'investors'  → visible to investors & admins
//   'mentors'    → visible to mentors & admins
const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'message-circle' },
    type: { type: String, enum: ['open', 'restricted', 'announce'], default: 'open' },
    targetAudience: { type: String, enum: ['all', 'founders', 'students', 'investors', 'mentors'], default: 'all' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    postCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

channelSchema.index({ isActive: 1, order: 1 });

// ─── Post ─────────────────────────────────────────────────────────────────────
const pollOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    votes: { type: Number, default: 0 },
    voterIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    body: { type: String, default: '' },
    // S3 image support
    imageKey: { type: String, default: null },   // S3 object key
    imageUrl: { type: String, default: null },   // public CDN URL
    // Poll
    poll: {
      question: { type: String, default: null },
      options: [pollOptionSchema],
    },
    likeCount: { type: Number, default: 0 },
    likerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commentCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

postSchema.index({ channelId: 1, createdAt: -1 });
postSchema.index({ authorId: 1, createdAt: -1 });

// ─── Comment ─────────────────────────────────────────────────────────────────
const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: 1 });

// ─── Legacy models (kept for Groups / Q&A tabs) ───────────────────────────────
const groupSchema = new mongoose.Schema(
  {
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    privacy: { type: String, enum: ['public', 'private', 'admin-only'], default: 'public' },
    avatarUrl: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const groupMemberSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' },
    status: { type: String, enum: ['active', 'pending', 'blocked'], default: 'active' },
  },
  { timestamps: true }
);
groupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

const questionSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    acceptedAnswerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: null },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isAccepted: { type: Boolean, default: false },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const groupMessageSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = {
  Channel: mongoose.model('Channel', channelSchema),
  Post: mongoose.model('Post', postSchema),
  Comment: mongoose.model('Comment', commentSchema),
  // Legacy & WhatsApp Groups
  Group: mongoose.model('Group', groupSchema),
  GroupMember: mongoose.model('GroupMember', groupMemberSchema),
  GroupMessage: mongoose.model('GroupMessage', groupMessageSchema),
  Question: mongoose.model('Question', questionSchema),
  Answer: mongoose.model('Answer', answerSchema),
};

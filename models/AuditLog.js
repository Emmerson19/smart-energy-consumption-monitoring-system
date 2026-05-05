import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    action: {
        type: String,
        required: [true, 'Action is required'],
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    targetType: String,
    source: {
        type: String,
        default: 'API',
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;

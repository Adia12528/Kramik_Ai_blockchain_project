# MongoDB Database Schema - Kramik Hub

## Overview
This project now uses **MongoDB Atlas** (cloud database) instead of PostgreSQL. All data is stored in MongoDB collections with Mongoose ODM.

## Database Connection
- **Provider**: MongoDB Atlas (Free Tier - 512MB)
- **Connection**: Configured in `backend/src/config/mongodb.js`
- **Connection String**: Stored in `.env` as `MONGODB_URI`

## Collections & Models

### 1. Users Collection
**Model**: `backend/src/models/User.js`

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required),
  userType: String (enum: ['student', 'admin'], default: 'student'),
  walletAddress: String,
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Used for**:
- User authentication (login/register)
- Admin and student accounts
- Blockchain wallet linking

---

### 2. Assignments Collection
**Model**: `backend/src/models/Assignment.js`

```javascript
{
  title: String (required),
  type: String (enum: ['assignment', 'project', 'lab'], required),
  subject: String (required),
  subjectCode: String (required),
  description: String (required),
  creditPoints: Number (default: 0),
  dueDate: Date (required),
  difficulty: String (enum: ['Easy', 'Medium', 'Hard'], default: 'Medium'),
  status: String (enum: ['active', 'archived', 'draft'], default: 'active'),
  fileUrl: String,
  fileName: String,
  cloudinaryPublicId: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Used for**:
- Admin creating assignments/projects/labs
- Students viewing assignments
- File storage via Cloudinary

---

### 3. StudentAssignments Collection
**Model**: `backend/src/models/StudentAssignment.js`

```javascript
{
  studentId: String (required),
  assignmentId: ObjectId (ref: 'Assignment', required),
  status: String (enum: ['pending', 'completed', 'submitted'], default: 'pending'),
  completedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- Compound unique index on `studentId` + `assignmentId`

**Used for**:
- Tracking student completion status
- Marking assignments as complete
- Dashboard statistics

---

### 4. Subjects Collection
**Model**: `backend/src/models/Subject.js`

```javascript
{
  name: String (required),
  code: String (required, unique),
  description: String (required),
  externalUrl: String,
  category: String (required),
  semester: Number (required),
  color: String (default: 'blue'),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Used for**:
- Subject management by admin
- Student subject browsing
- Course catalog

---

## Migration Summary

### What Changed:
✅ **Removed PostgreSQL completely**:
- Deleted `src/db.js` (PostgreSQL pool)
- Deleted `database/migrations/*.sql` files
- Removed `run-migration.js` and `create-users-table.js`
- Uninstalled `pg` package from package.json
- Removed PostgreSQL env variables from `.env`

✅ **Implemented MongoDB**:
- Created 4 Mongoose models (User, Assignment, Subject, StudentAssignment)
- Updated all controllers to use MongoDB queries
- Connected to MongoDB Atlas cloud database
- All CRUD operations now use Mongoose methods

### Controllers Updated:
1. **authController.js**: User login, register, blockchain auth
2. **adminController.js**: Dashboard stats, assignments CRUD, subjects CRUD
3. **studentController.js**: Get assignments with completion status, mark complete

### MongoDB Operations Used:
- `Model.create()` - Insert documents
- `Model.find()` - Query documents
- `Model.findOne()` - Find single document
- `Model.findById()` - Find by ObjectId
- `Model.findByIdAndUpdate()` - Update and return document
- `Model.findByIdAndDelete()` - Delete document
- `Model.findOneAndUpdate()` - Upsert operation
- `Model.countDocuments()` - Count matching documents

---

## Environment Variables

```env
# MongoDB (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kramik

# Authentication
JWT_SECRET=your_secret_key

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI
GEMINI_API_KEY=your_gemini_key
```

---

## Benefits of MongoDB Migration

1. ✅ **Free Cloud Hosting**: 512MB free tier on MongoDB Atlas
2. ✅ **No Local Database**: No need to install/run PostgreSQL locally
3. ✅ **Flexible Schema**: Easy to add/modify fields without migrations
4. ✅ **JSON Native**: Perfect for JavaScript/Node.js projects
5. ✅ **Automatic Timestamps**: `createdAt` and `updatedAt` auto-managed
6. ✅ **Better Performance**: Optimized for document-based queries
7. ✅ **Scalable**: Easy to upgrade as project grows

---

## Database Status
🟢 **Backend**: Connected to MongoDB Atlas  
🟢 **Collections**: 4 models (User, Assignment, Subject, StudentAssignment)  
🟢 **File Storage**: Cloudinary (25GB free)  
❌ **PostgreSQL**: Completely removed

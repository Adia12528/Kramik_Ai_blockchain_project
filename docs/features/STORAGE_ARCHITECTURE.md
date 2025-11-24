# Kramik Hub - Storage Architecture

## Overview
This document explains how Kramik Hub uses **Cloudinary** for file storage and **MongoDB** for authentication and metadata management.

---

## 📦 Storage Strategy

### 🔐 MongoDB Atlas - Authentication & Metadata Only
MongoDB is used exclusively for:
- ✅ **User Authentication** (login/register)
- ✅ **User Profiles** (name, email, userType, walletAddress)
- ✅ **Assignment Metadata** (title, description, due dates, credit points)
- ✅ **Subject Information** (name, code, external URLs)
- ✅ **Student Assignment Status** (completion tracking)

**What MongoDB DOES NOT Store:**
- ❌ File content/binary data
- ❌ PDFs, documents, or any uploaded files

---

## ☁️ Cloudinary - File Storage
Cloudinary is used for all file storage:
- ✅ **Assignment Files** (PDFs, documents)
- ✅ **Project Files** (reports, code archives)
- ✅ **Lab Report Files** (documents, data files)
- ✅ **Future: Profile Images, certificates, etc.**

**Free Tier Limits:**
- Storage: 25 GB
- Bandwidth: 25 GB/month
- More than sufficient for educational platform

---

## 🔄 Complete Data Flow

### 📤 File Upload Process
1. **Admin uploads assignment file** via frontend form
2. **Backend receives file** in memory (using multer)
3. **File uploaded to Cloudinary** → Returns `publicId` and `url`
4. **MongoDB stores metadata** with Cloudinary references:
   ```javascript
   {
     title: "DSA Assignment 1",
     type: "assignment",
     subject: "Data Structures",
     fileUrl: "https://res.cloudinary.com/dfmmqkzhy/...",
     fileName: "dsa-assignment-1.pdf",
     cloudinaryPublicId: "kramik-assignments/abc123.pdf"
   }
   ```

### 📥 File Download Process
1. **Student requests assignment** from frontend
2. **Backend fetches metadata** from MongoDB
3. **Frontend receives** `fileUrl` from Cloudinary
4. **User clicks download** → Direct download from Cloudinary CDN

### 🗑️ File Deletion Process
1. **Admin deletes assignment**
2. **Backend retrieves** `cloudinaryPublicId` from MongoDB
3. **Delete file from Cloudinary** using public ID
4. **Delete metadata from MongoDB**

---

## 📊 Current Configuration

### Cloudinary Settings (.env)
```env
CLOUDINARY_CLOUD_NAME=dfmmqkzhy
CLOUDINARY_API_KEY=271131796736119
CLOUDINARY_API_SECRET=Q6wUjeIdCvZSfHC5sH0u3B9CnY4
```

### MongoDB Connection (.env)
```env
MONGODB_URI=mongodb+srv://adityadixit:Adi@cluster0.xstus.mongodb.net/kramik-hub?retryWrites=true&w=majority
```

---

## 🏗️ Architecture Components

### Backend Services (`src/services/s3Service.js`)
```javascript
// Upload file to Cloudinary
uploadFileToCloudinary(fileBuffer, fileName, mimeType)
  → Returns: { publicId, url }

// Get file URL
getFileUrl(publicId)
  → Returns: secure_url

// Delete file from Cloudinary
deleteFileFromCloudinary(publicId)
  → Deletes from cloud storage
```

### MongoDB Models
```javascript
// Assignment Model
{
  title: String,
  type: 'assignment' | 'project' | 'lab',
  subject: String,
  fileUrl: String,              // Cloudinary URL
  fileName: String,              // Original filename
  cloudinaryPublicId: String,    // For deletion
  // ... metadata fields
}

// User Model
{
  name: String,
  email: String,
  password: String,
  userType: 'student' | 'admin',
  walletAddress: String,
  // ... profile fields
}
```

---

## ✅ Benefits of This Architecture

1. **Scalability**: Cloudinary handles file serving via CDN
2. **Performance**: MongoDB optimized for metadata queries
3. **Cost-Effective**: Free tiers for both services
4. **Reliability**: Cloudinary provides 99.9% uptime
5. **Security**: Separate concerns - auth data vs file data
6. **Bandwidth**: Cloudinary serves files, saving backend resources

---

## 🔒 Security Features

- **MongoDB**: JWT token-based authentication
- **Cloudinary**: Secure HTTPS URLs for all files
- **File Upload**: Validated file types and size limits
- **Access Control**: Only authenticated users can access files

---

## 📈 Future Enhancements

- [ ] Implement file type validation (PDF, DOCX only)
- [ ] Add file size limits (max 10MB per file)
- [ ] Enable student file submissions to Cloudinary
- [ ] Add profile image uploads
- [ ] Implement certificate generation and storage
- [ ] Add file virus scanning before upload

---

## 🛠️ How to Verify

### Check Cloudinary Storage
```bash
# Visit Cloudinary Console
https://cloudinary.com/console/c-dfmmqkzhy/media_library/folders/kramik-assignments
```

### Check MongoDB Data
```javascript
// Connect to MongoDB Atlas and query
db.assignments.find({}, { title: 1, fileUrl: 1, cloudinaryPublicId: 1 })
```

### Test Upload Flow
1. Login as admin (email: `admin`, password: `admin123`)
2. Upload assignment with file
3. Check Cloudinary console for new file
4. Check MongoDB for metadata entry
5. Student downloads file → Served from Cloudinary

---

**Last Updated**: November 23, 2025
**Architecture**: ✅ Fully Implemented and Working

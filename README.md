# Sketch History Board

## 📦 Prerequisites

- **Node.js**
- **npm**
- **Git**
- **Supabase Account**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/syahrul-ssh/sketch-history-board.git
cd sketch-history-board
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install
```

---

## ⚙️ Configuration

### 1. Backend Environment Variables

Create `.env` file in the `backend` directory:

```bash
cd backend
nano .env  # or use your favorite text editor
```

Add the following content:

```env
PORT=3000

NODE_ENV=development

DB_URI=your-uri-database

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_STORAGE_BUCKET=sketch
```

### 3. Frontend Environment Variables (Optional)

Create `.env.local` file in the `frontend` directory:

```bash
cd ../frontend
nano .env.local
```

Add:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

---

## 🎮 Usage

### Starting the Application

#### 1. Start Backend Server

```bash
cd backend
npm run start:dev
```

#### 2. Start Frontend Server

**Open a new terminal window:**

```bash
cd frontend
npm run dev
```

## 🎯 Design Reasoning

### 1. Why Next.js for Frontend?

**Reasoning:**
- ✅ **React-based**: Provides component-based architecture for modular, reusable UI components
- ✅ **TypeScript Support**: First-class TypeScript support for better DX and type safety
- ✅ **Performance**: Built-in optimizations (image optimization, code splitting, lazy loading)
- ✅ **Developer Experience**: Hot module replacement, fast refresh, excellent error messages
- ✅ **SEO Ready**: SSR/SSG capabilities (future-proof if we add landing pages)
- ✅ **API Routes**: Can add backend functionality without separate server
- ✅ **Modern Tooling**: Zero-config setup with webpack, babel, etc.
- ✅ **Production Ready**: Battle-tested framework used by major companies

### 2. Why NestJS for Backend?

**Reasoning:**
- ✅ **TypeScript-first**: Maintains consistency with frontend language
- ✅ **Modular Architecture**: Built-in dependency injection, modules, and decorators
- ✅ **Scalable**: Enterprise-grade architecture patterns (similar to Angular)
- ✅ **Express/Fastify**: Uses Express under the hood (familiar and widely adopted)
- ✅ **TypeORM Integration**: Excellent ORM support with decorators
- ✅ **Validation**: Built-in validation pipes with class-validator
- ✅ **Testability**: Dependency injection makes testing easier
- ✅ **Documentation**: Auto-generated API docs with Swagger (if needed)

### 3. Why Supabase Storage?

**Selected Storage:** Supabase Cloud Storage

**Reasoning:**
- ✅ **Scalable**: No file size limits, handles thousands of images
- ✅ **CDN Delivery**: Fast global image delivery through CDN
- ✅ **Cost-effective**: Free tier includes 1GB storage (1,100+ sketches)
- ✅ **Simple API**: Easy-to-use SDK with excellent TypeScript support
- ✅ **Public URLs**: Direct public URLs for images (no auth needed for public bucket)
- ✅ **Automatic Backups**: Built-in backup and disaster recovery
- ✅ **Image Transformations**: Can add image resizing/optimization later
- ✅ **Security**: Row-level security policies for access control

### 4. Data Structure Design

**Sketch Entity Schema:**
```typescript
{
  id: number;           // Auto-incrementing primary key
  title: string;        // User-defined version title
  imageUrl: string;     // Full-resolution image URL from Supabase
  thumbnailUrl: string; // Compressed thumbnail URL from Supabase
  createdAt: Date;      // Automatic timestamp
}
```

## 📊 Data Structure

### Database Schema

**Table: sketches**
```sql
CREATE TABLE sketches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  imageUrl TEXT NOT NULL,
  thumbnailUrl TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Example Record:**
```json
{
  "id": 1,
  "title": "My Awesome Drawing",
  "imageUrl": "https://abc123.supabase.co/storage/v1/object/public/sketches/full/sketch_1735234567890_abc123.png",
  "thumbnailUrl": "https://abc123.supabase.co/storage/v1/object/public/sketches/thumbnails/thumb_1735234567890_abc123.jpg",
  "createdAt": "2025-10-27T10:30:00.000Z"
}
```
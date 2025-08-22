# MTSE431179 CRUD Project

## 📋 Mô tả
Dự án CRUD (Create, Read, Update, Delete) quản lý người dùng sử dụng Node.js, Express, Sequelize và MySQL.

## 🛠️ Công nghệ sử dụng
- **Backend**: Node.js, Express.js
- **Database**: MySQL với Sequelize ORM
- **Template Engine**: EJS
- **Styling**: Bootstrap 5, Font Awesome
- **Environment**: dotenv

## 📁 Cấu trúc dự án
```
project_02/
├── src/
│   ├── config/
│   │   ├── configdb.js         # Cấu hình database connection
│   │   ├── config.js           # Sequelize configuration  
│   │   └── viewEngine.js       # EJS view engine setup
│   ├── controller/
│   │   └── homeController.js   # Xử lý logic CRUD
│   ├── models/
│   │   ├── index.js           # Sequelize models index
│   │   └── user.js            # User model
│   ├── migrations/
│   │   └── migration-create-user.js  # Database migration
│   ├── route/
│   │   └── web.js             # Route definitions
│   ├── services/
│   │   └── CRUDService.js     # Business logic
│   └── views/
│       ├── crud.ejs           # Form tạo user
│       └── users/
│           ├── findAllUser.ejs # Danh sách users
│           └── updateUser.ejs  # Form cập nhật user
├── .env                       # Environment variables
├── .env.example              # Template cho .env
└── package.json
```

## 🚀 Hướng dẫn cài đặt

### 1. Clone project
```bash
git clone <repository-url>
cd project_02
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
Sao chép file `.env.example` thành `.env` và cập nhật thông tin:
```bash
cp .env.example .env
```

Cập nhật thông tin database trong `.env`:
```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=127.0.0.1
DB_DIALECT=mysql

# Database Names
DB_NAME_DEV=database_development
```

### 4. Tạo database
```sql
CREATE DATABASE database_development;
```

### 5. Chạy migration
```bash
npm run sequelize db:migrate
```

### 6. Tạo dữ liệu mẫu (tùy chọn)
```bash
npm run create-sample
```

## 🎯 Scripts có sẵn

| Script | Mô tả |
|--------|--------|
| `npm start` | Khởi động server với nodemon |
| `npm run dev` | Chạy development mode |
| `npm run prod` | Chạy production mode |
| `npm run test-db` | Test kết nối database |
| `npm run check-tables` | Kiểm tra các bảng trong DB |
| `npm run test-user` | Test User model |
| `npm run create-sample` | Tạo dữ liệu mẫu |

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/` | Homepage |
| GET | `/home` | Home page |
| GET | `/crud` | Form tạo user mới |
| POST | `/post-crud` | Tạo user mới |
| GET | `/get-crud` | Danh sách tất cả users |
| GET | `/edit-crud?id=:id` | Form chỉnh sửa user |
| POST | `/put-crud` | Cập nhật user |
| GET | `/delete-crud?id=:id` | Xóa user |

## 🎨 Tính năng

### ✅ CRUD Operations
- **Create**: Tạo người dùng mới với form validation
- **Read**: Hiển thị danh sách người dùng với pagination
- **Update**: Chỉnh sửa thông tin người dùng
- **Delete**: Xóa người dùng với confirm dialog

### ✅ UI/UX Features
- 🎨 Modern gradient design
- 📱 Responsive layout
- 🔔 Toast notifications
- ⚡ Loading states
- 🖼️ User avatars
- 📊 User statistics

### ✅ Security Features
- 🔐 Environment variables
- 🛡️ Input validation
- 🔒 Error handling

## 🗃️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255),
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  address VARCHAR(255),
  phoneNumber VARCHAR(255),
  gender BOOLEAN,
  image VARCHAR(255),
  roleId VARCHAR(255),
  positionId VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME
);
```

## 🔧 Troubleshooting

### Lỗi "Table doesn't exist"
```bash
# Kiểm tra bảng hiện có
npm run check-tables

# Chạy lại migration
npx sequelize-cli db:migrate

# Tạo dữ liệu mẫu
npm run create-sample
```

### Lỗi kết nối database
```bash
# Test kết nối
npm run test-db

# Kiểm tra file .env
# Đảm bảo MySQL service đang chạy
```

## 👥 Phát triển

### Thêm field mới cho User
1. Tạo migration mới:
```bash
npx sequelize-cli migration:generate --name add-new-field-to-user
```

2. Cập nhật model `src/models/user.js`
3. Cập nhật views và controller

### Thêm model mới
```bash
npx sequelize-cli model:generate --name ModelName --attributes field1:string,field2:integer
```

## 📝 License
MIT License

## 👨‍💻 Author
MTSE431179 - Nguyễn Sang Huy

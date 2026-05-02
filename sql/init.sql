-- 用户表
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role VARCHAR(20) NOT NULL, -- teacher/student
  school VARCHAR(50),
  class_name VARCHAR(50),
  name VARCHAR(20),
  user_no VARCHAR(20) UNIQUE,
  password VARCHAR(50),
  phone VARCHAR(20),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 通知表
CREATE TABLE notices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100),
  content TEXT,
  level INT, -- 0普通1重要2紧急
  publisher VARCHAR(20),
  is_read INT DEFAULT 0,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 聊天表
CREATE TABLE chats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content TEXT,
  sender VARCHAR(20),
  sender_no VARCHAR(20),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 资料表
CREATE TABLE materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100),
  cate VARCHAR(20),
  `desc` TEXT,
  file_url TEXT,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 作业表
CREATE TABLE homeworks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100),
  content TEXT,
  deadline DATETIME,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 作业提交表
CREATE TABLE homework_submit (
  id INT PRIMARY KEY AUTO_INCREMENT,
  homework_id INT,
  user_no VARCHAR(20),
  user_name VARCHAR(20),
  content TEXT,
  file_url TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  score INT,
  comment TEXT,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 公告表
CREATE TABLE announcements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100),
  content TEXT,
  top INT DEFAULT 0,
  publisher VARCHAR(20),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 班级成员表
CREATE TABLE class_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_no VARCHAR(20),
  name VARCHAR(20),
  role VARCHAR(20),
  class_name VARCHAR(50),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 考勤表
CREATE TABLE attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  deadline DATETIME
);

-- 考勤打卡表
CREATE TABLE attendance_record (
  id INT PRIMARY KEY AUTO AUTO_INCREMENT,
  attendance_id INT,
  user_no VARCHAR(20),
  user_name VARCHAR(20),
  status VARCHAR(20) DEFAULT '未打卡', -- 已打卡/迟到/未打卡
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初始数据
INSERT INTO users (role, school, class_name, name, user_no, password) 
VALUES ('teacher','实验中学','高三1班','张老师','T001','123456'),
('student','实验中学','高三1班','小明','S001','123456');
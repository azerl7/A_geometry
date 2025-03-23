/*
 Navicat Premium Data Transfer

 Source Server         : mysql8.0.37
 Source Server Type    : MySQL
 Source Server Version : 80037 (8.0.37)
 Source Host           : localhost:3306
 Source Schema         : geometry_db_02

 Target Server Type    : MySQL
 Target Server Version : 80037 (8.0.37)
 File Encoding         : 65001

 Date: 23/03/2025 12:22:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tb_article
-- ----------------------------
DROP TABLE IF EXISTS `tb_article`;
CREATE TABLE `tb_article`  (
  `aid` int(255) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT '文章ID',
  `tittle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '文章标题',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '文章内容',
  `face` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NULL DEFAULT 'http://127.0.0.1/imgs/geometry.jpg',
  `uid` int(11) UNSIGNED ZEROFILL NOT NULL COMMENT '创建者ID',
  `cid` int(11) UNSIGNED ZEROFILL NOT NULL COMMENT '所属分类',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建的时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改的时间',
  `status` enum('deleted','published','draft','examine') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NULL DEFAULT 'examine' COMMENT '文章状态',
  PRIMARY KEY (`aid`) USING BTREE,
  UNIQUE INDEX `tittle`(`tittle` ASC) USING BTREE,
  INDEX `uid`(`uid` ASC) USING BTREE,
  INDEX `cid`(`cid` ASC) USING BTREE,
  INDEX `status`(`status` ASC) USING BTREE,
  INDEX `aid`(`aid` ASC, `status` ASC) USING BTREE,
  CONSTRAINT `cid` FOREIGN KEY (`cid`) REFERENCES `tb_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uid` FOREIGN KEY (`uid`) REFERENCES `tb_users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 118 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_cs ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tb_categories
-- ----------------------------
DROP TABLE IF EXISTS `tb_categories`;
CREATE TABLE `tb_categories`  (
  `id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NULL,
  `status` enum('deleted','nodeleted') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL DEFAULT 'nodeleted',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_cs ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tb_examine
-- ----------------------------
DROP TABLE IF EXISTS `tb_examine`;
CREATE TABLE `tb_examine`  (
  `aid` int(11) UNSIGNED ZEROFILL NOT NULL COMMENT '申请审核的文章id',
  `cid` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT '申请审核的文章分类id',
  `tittle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `face` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '申请审核的文章封面',
  `status` enum('deleted','published','draft','examine') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '提交申请的时间',
  UNIQUE INDEX `aid`(`aid` ASC) USING BTREE,
  INDEX `tittle`(`tittle` ASC) USING BTREE,
  INDEX `status`(`status` ASC) USING BTREE,
  INDEX `aidtoall`(`aid` ASC, `status` ASC) USING BTREE,
  CONSTRAINT `aidtoall` FOREIGN KEY (`aid`, `status`) REFERENCES `tb_article` (`aid`, `status`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_cs ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tb_managers
-- ----------------------------
DROP TABLE IF EXISTS `tb_managers`;
CREATE TABLE `tb_managers`  (
  `uid` int(11) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `username` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '用户电子邮箱',
  PRIMARY KEY (`uid`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE COMMENT '用户账号',
  UNIQUE INDEX `email`(`email` ASC) USING BTREE COMMENT '用户邮箱',
  INDEX `user`(`email` ASC, `uid` ASC, `username` ASC) USING BTREE,
  CONSTRAINT `user` FOREIGN KEY (`email`, `uid`, `username`) REFERENCES `tb_users` (`email`, `uid`, `username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_cs ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tb_users
-- ----------------------------
DROP TABLE IF EXISTS `tb_users`;
CREATE TABLE `tb_users`  (
  `uid` int(11) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT '用户账号',
  `username` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '用户电子邮箱',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NULL DEFAULT 'http://127.0.0.1:7274/imgs/geometry.jpg' COMMENT '用户头像',
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NULL DEFAULT '新用户' COMMENT '用户昵称',
  `udesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NULL DEFAULT '占时没有描述' COMMENT '用户描述',
  PRIMARY KEY (`uid`) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  INDEX `email_2`(`email` ASC, `uid` ASC, `username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_cs ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tr_article
-- ----------------------------
DROP TABLE IF EXISTS `tr_article`;
CREATE TABLE `tr_article`  (
  `id` int(255) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT '这次操作的id',
  `aid` int(11) UNSIGNED ZEROFILL NOT NULL COMMENT '操作对象的id',
  `oldTittle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '旧的标题',
  `newTittle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '新的标题',
  `oldContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '旧的内容',
  `newContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '新的内容',
  `oldFace` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '旧的封面',
  `newFace` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '新的封面',
  `oldStatus` enum('draft','deleted','published','examine') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NULL DEFAULT NULL,
  `newStatus` enum('draft','deleted','published','examine') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NULL DEFAULT NULL,
  `time` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id` DESC) USING BTREE,
  INDEX `fr_tr_aid`(`id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 87 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_cs ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tr_categories
-- ----------------------------
DROP TABLE IF EXISTS `tr_categories`;
CREATE TABLE `tr_categories`  (
  `id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `cid` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT '操作对象的id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `oldDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '修改之前的数据',
  `newDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL COMMENT '修改之后的数据',
  `oldStatus` enum('deleted','nodeleted') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `newStatus` enum('deleted','nodeleted') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL,
  `time` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id` DESC) USING BTREE,
  INDEX `fr_cid`(`cid` ASC) USING BTREE,
  CONSTRAINT `fr_cid` FOREIGN KEY (`cid`) REFERENCES `tb_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_as_cs ROW_FORMAT = Dynamic;

-- ----------------------------
-- Procedure structure for get_atl_page
-- ----------------------------
DROP PROCEDURE IF EXISTS `get_atl_page`;
delimiter ;;
CREATE PROCEDURE `get_atl_page`(in page_num int,in page_size int,in userid int)
begin
declare offset int;
set offset=(page_num-1)*page_size;
select * from tb_article where uid=userid limit offset,page_size;
end
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table tb_article
-- ----------------------------
DROP TRIGGER IF EXISTS `before_update_article`;
delimiter ;;
CREATE TRIGGER `before_update_article` BEFORE UPDATE ON `tb_article` FOR EACH ROW insert into tr_article(aid,oldTittle,newTittle,oldContent,newContent,oldFace,newFace,oldStatus,newStatus,time) values(old.aid,old.tittle,new.tittle,old.content,new.content,old.face,new.face,old.status,new.status,now())
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table tb_categories
-- ----------------------------
DROP TRIGGER IF EXISTS `before_update_tb_categories`;
delimiter ;;
CREATE TRIGGER `before_update_tb_categories` BEFORE UPDATE ON `tb_categories` FOR EACH ROW insert into tr_categories(cid,name,oldDescription,newDescription,oldStatus,newStatus,time) values(old.id,old.name,old.description,new.description,old.status,new.status,now())
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;

/*
  Warnings:

  - Added the required column `gender` to the `student_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `teacher_profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "student_profile" ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "teacher_profile" ADD COLUMN     "gender" "Gender" NOT NULL;

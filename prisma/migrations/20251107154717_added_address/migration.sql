/*
  Warnings:

  - Added the required column `address` to the `student_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `teacher_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `teacher_profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student_profile" ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teacher_profile" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL;

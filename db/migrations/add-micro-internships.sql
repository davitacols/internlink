-- Add micro-internship fields to the Internship table
ALTER TABLE "Internship" 
ADD COLUMN "isMicroInternship" BOOLEAN DEFAULT FALSE,
ADD COLUMN "durationHours" INTEGER,
ADD COLUMN "durationWeeks" INTEGER,
ADD COLUMN "weeklyCommitment" INTEGER,
ADD COLUMN "isFlexibleSchedule" BOOLEAN DEFAULT FALSE,
ADD COLUMN "projectType" VARCHAR(255),
ADD COLUMN "deliverables" TEXT;


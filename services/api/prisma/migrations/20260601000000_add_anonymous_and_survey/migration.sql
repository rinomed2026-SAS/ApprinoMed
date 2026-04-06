-- AlterTable: add anonymous column to Question
ALTER TABLE "Question" ADD COLUMN "anonymous" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: SurveyResponse
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "contentRating" INTEGER NOT NULL,
    "organizationRating" INTEGER NOT NULL,
    "venueRating" INTEGER NOT NULL,
    "wouldRecommend" BOOLEAN NOT NULL DEFAULT true,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique userId on SurveyResponse
CREATE UNIQUE INDEX "SurveyResponse_userId_key" ON "SurveyResponse"("userId");

-- AlterTable: add foreign key for SurveyResponse -> User
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: add appCaption column to CommunitySubmission
ALTER TABLE "CommunitySubmission" ADD COLUMN "appCaption" TEXT;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

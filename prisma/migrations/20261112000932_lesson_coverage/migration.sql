-- CreateTable
CREATE TABLE "LessonCoverage" (
    "lessonId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    PRIMARY KEY ("lessonId", "topicId"),
    CONSTRAINT "LessonCoverage_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LessonCoverage_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

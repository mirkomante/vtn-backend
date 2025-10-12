-- CreateTable
CREATE TABLE "logs" (
    "id" BIGSERIAL NOT NULL,
    "level" VARCHAR(10) NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" VARCHAR(20) NOT NULL,
    "request_id" VARCHAR(100),
    "user_id" VARCHAR(100),
    "ip_address" INET,
    "user_agent" TEXT,
    "method" VARCHAR(10),
    "url" TEXT,
    "status_code" INTEGER,
    "duration" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

FROM oven/bun:latest
WORKDIR /app

# نسخ ملفات الباكج والقفل
COPY package.json bun.lock ./

# تثبيت التبعيات (الاعتماد على ملف القفل الذي تم نسخه)
RUN bun install --production

# نسخ باقي ملفات التطبيق
COPY . .

# أمر تشغيل التطبيق مباشرة من المصدر
CMD ["bun", "src/index.ts"]
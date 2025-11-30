# 1. المرحلة الأولى: البناء (Compilation Stage)
FROM oven/bun:latest AS builder
WORKDIR /app
COPY package.json bun.lock ./
# تثبيت التبعيات الضرورية للبناء
RUN bun install 
COPY . .
# تجميع كود TypeScript إلى JavaScript في مجلد dist
RUN bun run build 

# 2. المرحلة الثانية: التشغيل (Runtime Stage)
# استخدام صورة bun مرة أخرى للحجم الصغير
FROM oven/bun:latest 
WORKDIR /app

# نسخ التبعيات المطلوبة للتشغيل
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
# تثبيت التبعيات التشغيلية فقط (بدون devDependencies)
RUN bun install --production

# نسخ الملفات المجمعة النهائية
COPY --from=builder /app/dist ./dist 
COPY --from=builder /app/src/config/DB.config.ts ./src/config/DB.config.ts
# إذا كان لديك ملفات أخرى غير مجمعة في dist وتحتاجها (مثل ملفات الكونفيج التي تقرأ مباشرة)

# أمر تشغيل الملف المجمع
CMD ["bun", "dist/index.js"]
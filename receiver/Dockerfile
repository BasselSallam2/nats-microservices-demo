# ==============================
# 1. المرحلة الأولى: مرحلة البناء (Compilation Stage)
# ==============================
FROM oven/bun:latest AS builder
WORKDIR /app
# 1. نسخ ملفات الباكج والقفل
COPY package.json bun.lock ./
# 2. تثبيت جميع التبعيات (بما في ذلك devDependencies للتجميع)
RUN bun install 
# 3. نسخ كود المصدر
COPY . .
# 4. تجميع كود TypeScript إلى JavaScript في مجلد dist
# (يفترض أن أمر build في package.json هو: bun build ./src/index.ts --outdir ./dist --external "*")
RUN bun run build 

# ==============================
# 2. المرحلة الثانية: مرحلة التشغيل (Runtime Stage)
# ==============================
FROM oven/bun:latest 
WORKDIR /app

# 5. نسخ التبعيات المطلوبة للتشغيل (لصورة أخف)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
RUN bun install --production

# 6. نسخ الملفات التنفيذية والاعتماديات التي يحتاجها ملف index.js:

# نسخ مجلد التجميع (dist)
COPY --from=builder /app/dist ./dist 

# نسخ مجلدات SRC التي يتم استيرادها بالمسار المطلق (لحل خطأ 'models/activity/activity.service')
# يجب نسخها بنفس الهيكلية التي يتوقعها index.js
COPY --from=builder /app/src/models ./src/models 
COPY --from=builder /app/src/config ./src/config
COPY --from=builder /app/utils ./utils 

# أمر تشغيل الملف المجمع
CMD ["bun", "dist/index.js"]
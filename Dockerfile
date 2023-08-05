FROM node:latest

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY

ENV SUPABASE_URL $SUPABASE_URL
ENV SUPABASE_ANON_KEY $SUPABASE_ANON_KEY

EXPOSE 6969

CMD ["npm", "start"]
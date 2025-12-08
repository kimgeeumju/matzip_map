// postcss.config.mjs

const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // 🔴 tailwindcss 말고 이거 하나만 쓰면 됨
  },
};

export default config;

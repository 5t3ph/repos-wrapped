module.exports = {
  url: process.env.URL || "http://localhost:8080",
  siteName: "repos wrapped",
  description: "A yearly review of your public GitHub repository stats",
  currentYear: new Date().getFullYear(),
};

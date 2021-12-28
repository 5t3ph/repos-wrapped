const { DateTime } = require("luxon");
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "stats",
    functionsDir: "./netlify/functions/",
  });

  eleventyConfig.addShortcode("mostStarred", (repos) => {
    const originalRepos = [...repos];
    const repo = originalRepos.sort((a, b) => {
      return b.stargazers_count - a.stargazers_count;
    })[0];

    return `⭐️ ${repo.stargazers_count}<br><a href="${repo.html_url}">${repo.name}</a>`;
  });

  eleventyConfig.addFilter("lastUpdated", (repos) => {
    return repos.sort((a, b) => {
      new Date(a.updated_at) - new Date(b.updated_at);
    })[0].updated_at;
  });

  eleventyConfig.addFilter("repoDate", (date) => {
    const d = DateTime.fromISO(date);
    return d.toFormat("LLL d, yyyy");
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};

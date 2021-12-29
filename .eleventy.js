const { DateTime } = require("luxon");
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

const dateFormat = (date) => {
  const d = DateTime.fromISO(date);
  return d.toFormat("LLL d, yyyy");
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addPassthroughCopy("./src/img/");

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

  eleventyConfig.addShortcode("ogStars", (repos) => {
    const originalRepos = [...repos];
    const repo = originalRepos.sort((a, b) => {
      return b.stargazers_count - a.stargazers_count;
    })[0];

    return `${repo.stargazers_count}/${repo.name}`;
  });

  eleventyConfig.addShortcode("lastUpdated", (repos) => {
    const originalRepos = [...repos];
    const repo = originalRepos.sort((a, b) => {
      return DateTime.fromISO(b.pushed_at) - DateTime.fromISO(a.pushed_at);
    })[0];

    return `${dateFormat(repo.pushed_at)}<br><a href="${repo.html_url}">${
      repo.name
    }</a>`;
  });

  eleventyConfig.addFilter("repoDate", (date) => {
    return dateFormat(date);
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};

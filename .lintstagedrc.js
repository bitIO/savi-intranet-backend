module.exports = {
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  // '*.md': 'markdownlint --fix --ignore CHANGELOG.md',
  '*': 'cspell --no-summary --no-progress',
};

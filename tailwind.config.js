const c = (v) => `rgb(var(--${v}) / <alpha-value>)`;
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ink: c('ink'), clay: c('clay'), 'clay-dark': c('clay-dark'), sand: c('sand'), cream: c('cream'), line: c('line'), muted: c('muted'), surface: c('surface') },
    fontFamily: { display: ['var(--font-display)', 'serif'], body: ['var(--font-body)', 'system-ui', 'sans-serif'] } } },
  plugins: [] };

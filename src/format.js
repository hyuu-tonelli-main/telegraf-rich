const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const MARKDOWN_V2_SPECIALS = /[_*[\]()~`>#+\-=|{}.!\\]/g;

export function escapeHtml(value) {
  return String(value).replace(/[&<>]/g, (char) => HTML_ESCAPES[char]);
}

export function escapeMarkdownV2(value) {
  return String(value).replace(MARKDOWN_V2_SPECIALS, (char) => `\\${char}`);
}

export function bold(value) {
  return `<b>${escapeHtml(value)}</b>`;
}

export function italic(value) {
  return `<i>${escapeHtml(value)}</i>`;
}

export function code(value) {
  return `<code>${escapeHtml(value)}</code>`;
}

export function pre(value, language = '') {
  const openTag = language ? `<pre><code class="language-${escapeHtml(language)}">` : '<pre>';
  const closeTag = language ? '</code></pre>' : '</pre>';
  return `${openTag}${escapeHtml(value)}${closeTag}`;
}

export function link(label, url) {
  return `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>`;
}

export function blockquote(value, expandable = false) {
  return `<blockquote${expandable ? ' expandable' : ''}>${escapeHtml(value)}</blockquote>`;
}

export function spoiler(value) {
  return `<tg-spoiler>${escapeHtml(value)}</tg-spoiler>`;
}

export function mention(name, userId) {
  return `<a href="tg://user?id=${encodeURIComponent(userId)}">${escapeHtml(name)}</a>`;
}

export function bulletList(items) {
  return items.map((item) => `• ${escapeHtml(item)}`).join('\n');
}

export function section(title, lines) {
  return [bold(title), ...lines].join('\n');
}

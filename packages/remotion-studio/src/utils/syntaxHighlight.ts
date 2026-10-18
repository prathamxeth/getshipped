export interface Token {
  content: string;
  color: string;
  fontStyle?: string;
}

export interface HighlightedLine {
  lineNumber: number;
  tokens: Token[];
  type?: 'added' | 'removed' | 'context' | 'modified';
  highlight?: boolean;
}

// Color palette inspired by Tokyo Night / Vesper Shiki themes
const THEME_COLORS = {
  keyword: '#BB9AF7',     // purple/violet (export, async, function, const, await, for, if, return, yield)
  function: '#7AA2F7',    // blue (retrieveContextStream, predictMultiHop, rerank, slice)
  type: '#2AC3DE',        // cyan (Promise, DocumentChunk, AsyncGenerator, SharedArrayRingBuffer)
  string: '#9ECE6A',      // green ('query', "feat/speculative-graph")
  comment: '#565F89',     // muted gray-blue (// 1. Concurrent speculative AST)
  number: '#FF9E64',      // orange (1024, 0.94, 50, 10, 14.2)
  operator: '#89DDFF',    // bright cyan (=, :, *, >, <, .)
  punctuation: '#9AA5CE', // soft slate (, ;, (, ), {, }, [, ])
  variable: '#C0CAF5',    // crisp white/lavender
  special: '#F7768E',     // pink/red (throw, new, void)
};

const KEYWORDS = new Set([
  'export', 'async', 'function', 'const', 'let', 'var', 'await', 'for', 'of',
  'in', 'if', 'else', 'return', 'yield', 'import', 'from', 'as', 'type', 'interface',
  'class', 'extends', 'implements', 'new', 'void', 'default'
]);

const TYPES = new Set([
  'Promise', 'Document', 'DocumentChunk', 'AsyncGenerator', 'SharedArrayRingBuffer',
  'string', 'number', 'boolean', 'void', 'null', 'undefined', 'any', 'unknown'
]);

/**
 * Tokenizes a single line of TypeScript code with high-fidelity syntax highlighting.
 */
export function tokenizeLine(lineText: string): Token[] {
  if (!lineText) {
    return [{ content: ' ', color: THEME_COLORS.variable }];
  }

  // Check if comment line
  const trimmed = lineText.trim();
  if (trimmed.startsWith('//')) {
    return [{ content: lineText, color: THEME_COLORS.comment, fontStyle: 'italic' }];
  }

  const tokens: Token[] = [];
  // Tokenizer regex matching strings, numbers, words, comments, and symbols
  const regex = /(\/\/.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)|([=><+\-*/!&|?]+)|([()[\]{},;.:])/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(lineText)) !== null) {
    // Add any whitespace or uncaptured characters between tokens
    if (match.index > lastIndex) {
      tokens.push({
        content: lineText.substring(lastIndex, match.index),
        color: THEME_COLORS.variable,
      });
    }

    const [fullMatch, comment, str, num, word, operator, punctuation] = match;

    if (comment) {
      tokens.push({ content: comment, color: THEME_COLORS.comment, fontStyle: 'italic' });
    } else if (str) {
      tokens.push({ content: str, color: THEME_COLORS.string });
    } else if (num) {
      tokens.push({ content: num, color: THEME_COLORS.number });
    } else if (word) {
      if (KEYWORDS.has(word)) {
        tokens.push({ content: word, color: word === 'new' || word === 'void' ? THEME_COLORS.special : THEME_COLORS.keyword });
      } else if (TYPES.has(word) || /^[A-Z][a-zA-Z0-9]*$/.test(word)) {
        tokens.push({ content: word, color: THEME_COLORS.type });
      } else if (lineText[match.index + word.length] === '(') {
        tokens.push({ content: word, color: THEME_COLORS.function });
      } else {
        tokens.push({ content: word, color: THEME_COLORS.variable });
      }
    } else if (operator) {
      tokens.push({ content: operator, color: THEME_COLORS.operator });
    } else if (punctuation) {
      tokens.push({ content: punctuation, color: THEME_COLORS.punctuation });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < lineText.length) {
    tokens.push({
      content: lineText.substring(lastIndex),
      color: THEME_COLORS.variable,
    });
  }

  return tokens;
}

/**
 * Converts raw code string into highlighted tokenized lines.
 */
export function highlightCode(code: string): HighlightedLine[] {
  const lines = code.split('\n');
  return lines.map((line, idx) => ({
    lineNumber: idx + 1,
    tokens: tokenizeLine(line),
  }));
}

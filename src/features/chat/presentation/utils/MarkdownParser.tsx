import React from 'react';
import { Text } from 'react-native';

/**
 * Simple Markdown Parser para React Native
 * Soporta: **negrita**, *itálica*, `código`
 * Sin dependencias externas (compatible con Expo)
 */

interface MarkdownSegment {
  type: 'text' | 'bold' | 'italic' | 'code';
  content: string;
}

// Tokenize markdown usando un enfoque simple y robusto
const tokenizeMarkdown = (text: string): MarkdownSegment[] => {
  const tokens: MarkdownSegment[] = [];
  let i = 0;

  while (i < text.length) {
    // Buscar **bold**
    if (text[i] === '*' && text[i + 1] === '*') {
      let j = i + 2;
      let foundEnd = false;
      
      while (j < text.length - 1) {
        if (text[j] === '*' && text[j + 1] === '*') {
          tokens.push({
            type: 'bold',
            content: text.substring(i + 2, j),
          });
          i = j + 2;
          foundEnd = true;
          break;
        }
        j++;
      }
      
      if (foundEnd) continue;
      // Si no encontramos el cierre, tratar ** como texto normal y avanzar
      tokens.push({ type: 'text', content: '**' });
      i += 2;
      continue;
    }

    // Buscar `code`
    if (text[i] === '`') {
      let j = i + 1;
      let foundEnd = false;
      
      while (j < text.length) {
        if (text[j] === '`') {
          tokens.push({
            type: 'code',
            content: text.substring(i + 1, j),
          });
          i = j + 1;
          foundEnd = true;
          break;
        }
        j++;
      }
      
      if (foundEnd) continue;
      // Si no encontramos el cierre, tratar ` como texto normal y avanzar
      tokens.push({ type: 'text', content: '`' });
      i += 1;
      continue;
    }

    // Buscar *italic* (pero no **)
    if (text[i] === '*' && text[i + 1] !== '*' && (i === 0 || text[i - 1] !== '*')) {
      let j = i + 1;
      let foundEnd = false;
      
      while (j < text.length) {
        if (text[j] === '*' && text[j + 1] !== '*') {
          tokens.push({
            type: 'italic',
            content: text.substring(i + 1, j),
          });
          i = j + 1;
          foundEnd = true;
          break;
        }
        j++;
      }
      
      if (foundEnd) continue;
      // Si no encontramos el cierre, tratar * como texto normal y avanzar
      tokens.push({ type: 'text', content: '*' });
      i += 1;
      continue;
    }

    // Acumular texto normal
    let plainText = '';
    while (
      i < text.length &&
      !(text[i] === '*' && text[i + 1] === '*') &&
      !(text[i] === '*' && text[i + 1] !== '*' && (i === 0 || text[i - 1] !== '*')) &&
      text[i] !== '`'
    ) {
      plainText += text[i];
      i++;
    }

    if (plainText) {
      tokens.push({
        type: 'text',
        content: plainText,
      });
    }
  }

  return tokens;
};

interface MarkdownTextProps {
  children: string;
  isUser: boolean;
  style?: any;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ children, isUser, style }) => {
  const baseColor = isUser ? '#FFFFFF' : '#1E293B';
  const lines = children.split('\n');

  const renderSegments = (segments: MarkdownSegment[]) => {
    return segments.map((segment, idx) => {
      const key = `${idx}-${segment.type}`;
      switch (segment.type) {
        case 'bold':
          return (
            <Text key={key} style={{ fontWeight: '700' }}>
              {segment.content}
            </Text>
          );
        case 'italic':
          return (
            <Text key={key} style={{ fontStyle: 'italic' }}>
              {segment.content}
            </Text>
          );
        case 'code':
          return (
            <Text
              key={key}
              style={{
                backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(30,41,59,0.1)',
                paddingHorizontal: 4,
                borderRadius: 3,
                fontFamily: 'monospace',
                fontSize: 12,
              }}
            >
              {segment.content}
            </Text>
          );
        case 'text':
        default:
          return segment.content;
      }
    });
  };

  return (
    <Text style={[{ color: baseColor, fontSize: 15, lineHeight: 21 }, style]}>
      {lines.map((line, lineIdx) => (
        <React.Fragment key={`line-${lineIdx}`}>
          {renderSegments(tokenizeMarkdown(line))}
          {lineIdx < lines.length - 1 && '\n'}
        </React.Fragment>
      ))}
    </Text>
  );
};

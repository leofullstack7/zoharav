import type { ReactNode } from "react";

/**
 * A small, purpose-built renderer for the legal MDX documents under content/legal.
 *
 * These four documents use a known, bounded subset of Markdown (##/### headings,
 * paragraphs, bold, links, bullet/numbered lists, simple tables, and HTML comments
 * used as internal review notes). Rather than pull in an MDX/remark toolchain for
 * four static pages, this walks the text directly and returns the matching JSX.
 */
export function renderLegalMarkdown(markdown: string): ReactNode {
  const cleaned = markdown.replace(/<!--[\s\S]*?-->/g, "");
  const lines = cleaned.split(/\r?\n/);

  const nodes: ReactNode[] = [];
  let key = 0;
  let i = 0;

  const isHeading3 = (line: string) => /^###\s+/.test(line);
  const isHeading2 = (line: string) => /^##\s+/.test(line);
  const isTableRow = (line: string) => /^\s*\|/.test(line);
  const isBullet = (line: string) => /^-\s+/.test(line);
  const isOrdered = (line: string) => /^\d+\.\s+/.test(line);
  const isSpecial = (line: string) =>
    isHeading2(line) || isHeading3(line) || isTableRow(line) || isBullet(line) || isOrdered(line);

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (isHeading3(line)) {
      nodes.push(<h3 key={key++}>{renderInline(line.replace(/^###\s+/, ""), key)}</h3>);
      i++;
      continue;
    }

    if (isHeading2(line)) {
      nodes.push(<h2 key={key++}>{renderInline(line.replace(/^##\s+/, ""), key)}</h2>);
      i++;
      continue;
    }

    if (isTableRow(line)) {
      const tableLines: string[] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }
      nodes.push(renderTable(tableLines, key++));
      continue;
    }

    if (isBullet(line)) {
      const items: string[] = [];
      while (i < lines.length && isBullet(lines[i])) {
        items.push(lines[i].replace(/^-\s+/, ""));
        i++;
      }
      nodes.push(
        <ul className="diamonds" key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `${key}-${idx}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (isOrdered(line)) {
      const items: string[] = [];
      while (i < lines.length && isOrdered(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      nodes.push(
        <ol className="legal-ordered" key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `${key}-${idx}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !isSpecial(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    nodes.push(<p key={key++}>{renderInline(paraLines.join(" "), key)}</p>);
  }

  return nodes;
}

function renderTable(tableLines: string[], key: number): ReactNode {
  const rows = tableLines.map((line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim()),
  );

  const header = rows[0] ?? [];
  // rows[1] is the "| --- | --- |" separator row — not rendered.
  const body = rows.slice(2);

  return (
    <div className="legal-table-wrap" key={key}>
      <table className="legal-table">
        <thead>
          <tr>
            {header.map((cell, idx) => (
              <th key={idx}>{renderInline(cell, `th-${idx}`)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx}>{renderInline(cell, `td-${rowIdx}-${cellIdx}`)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderInline(text: string, keyPrefix: string | number): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter((part) => part !== "");

  return parts.map((part, idx) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return <strong key={`${keyPrefix}-${idx}`}>{bold[1]}</strong>;
    }

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a key={`${keyPrefix}-${idx}`} href={href} {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}>
          {label}
        </a>
      );
    }

    return part;
  });
}

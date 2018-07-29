export function styleSheetsLoaded(styleSheets: Node[]) {
  return Promise.all(styleSheets.map(styleSheetLoaded));
}

export function styleSheetLoaded(styleSheet: Node) {
  return new Promise((resolve) => {
    styleSheet.addEventListener('load', resolve, true);
  });
}

export function cloneStyleSheets(
  sourceDocument: Document,
  targetDocument: Document,
) {
  const styleSheets = Array.from(sourceDocument.styleSheets).map(
    (styleSheet) => {
      const clonedStyleSheet = styleSheet.ownerNode.cloneNode(true);
      targetDocument.head.appendChild(clonedStyleSheet);

      return clonedStyleSheet;
    },
  );

  return styleSheets;
}

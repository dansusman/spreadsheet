# Redux Actions we will need

## Core

-   [x] addRow
-   [x] deleteRow
-   [x] addCol
-   [x] deleteCol
-   [ ] addText
-   [ ] clearText

## Extra

-   [ ] fillCell

### notes

1. When any Redux action is applied, add that action to Undo stack.
2. When Undo is clicked, add action to Redo stack.
3. We need to create an enum for color options (WHITE, RED, ORANGE, etc.)
    - map "WHITE": #ffffff, etc.

# Other

-   [x] Undo/Redo
-   [ ] Error detection
-   [ ] Parsing for equations (mathJS, custom str concat)
    -   check for "=" $\implies$ use mathJS
    -   check for '"' or "'" $\implies$ use custom str concat
    -   check for any errors in equation/plaintext $\implies$ throw error
-   [ ] REF, SUM, AVG (parse "REF", etc.)
    -   if SUM or AVG, parse for ".." $\implies$ apply function over range

# Redux Actions we will need

## Core

-   [x] addRow
-   [x] deleteRow
-   [x] addCol
-   [x] deleteCol
-   [x] addText
-   [x] clearText

## Extra

-   [x] fillCell

# Other

-   [x] Undo/Redo
-   [x] Error detection
-   [x] Recompute when equation's dependencies change
-   [x] Parsing for equations (mathJS, custom str concat)
    -   check for "=" $\implies$ use mathJS
    -   check for '"' or "'" $\implies$ use custom str concat
    -   check for any errors in equation/plaintext $\implies$ throw error
-   [x] SUM
-   [x] AVG
-   [x] REF
-   [x] string concat

-   [x] Clear Contents of single cell
-   [ ] Clear whole spreadsheet
-   [ ] Update Favicon

# TESTING

-   cells containing values and various types of formulas
-   insertion and deletion of rows and columns
-   clearing the contents of a cell

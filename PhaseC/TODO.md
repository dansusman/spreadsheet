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

-   Undo/Redo
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
-   [x] Update Favicon

# BUGS:

- [x] Add Column seems to add to the end, or something...

# TESTING

-   Grid
    -   Adding Rows
        -   Add row at beginning/end
        -   Add row that shifts references
        -   Add multiple rows consecutively
    -   Adding Columns
            See above
    -   Deleting Rows
        -   Deleting from beginning/end
        -   Attempting deletion with only 1 row
        -   Deleting rows that contain references
        -   Deleting multiple rows consecutively
    -   Deleting Columns
        -   See Above

    -   FILL CELL
        -   Check every color

    -   UNDO/REDO
        -   Undo/redo as first action (grid and cell actions)
        -   Undo/redo single action
        -   Undo/redo up to five actions
        -   Undo a redo
        -   Make sure range functions update with undo/redo
        
    -   On Key Enter
        -   Check that content is submitted to the grid state

-   Util
    -   General
        -   [x] Range functions and arithmetic without equals sign
        -   [x] Circularity
        -   [x] Errors

    -   [x] Parsing: Basic Arithmetic
        -   [x] Check every operation
        -   [x] Order of operations (parens)
    -   [x] Parsing: SUM
        -   [x] Basic SUM range
        -   [x] SUM REFs and AVGs
        -   [x] SUM a large range of cells
        -   [x] Updating sum when cell in range is updated
    -   [x] Parsing: REF
        -   [x] Basic REF
        -   [x] Empty REF
        -   [x] REF cell w SUM/AVG
        -   [x] REF another REF
        -   [x] Update REF when the reference (or reference of reference) is changed
            -   [x] Both deletion and modification
    -   [x] Parsing: AVG
        -   [x] Basic AVG range
        -   [x] AVG a large range of cells
        -   [x] AVG of SUMs/REFs
        -   [x] Updating AVG when cell in range is updated
        
    -   [x] String Concat
        -   [x] Concat two normal strings
        -   [x] Concat multiple strings
        -   [x] Concat string with non-string
        -   [x] Open quote(s)
        -   [x] Concat with a number ("zip" + 4)

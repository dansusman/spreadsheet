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
-   [x] Update Favicon

# BUGS:

- [x] Add Column seems to add to the end, or something...

# TESTING

-   Grid
        Adding Rows
            Add row at beginning/end
            Add row that shifts references
            Add multiple rows consecutively
        Adding Columns
            See above
        Deleting Rows
            Deleting from beginning/end
            Attempting deletion with only 1 row
            Deleting rows that contain references
            Deleting multiple rows consecutively
        Deleting Columns
            See Above

        FILL CELL
            Check every color

        UNDO/REDO
            Undo/redo as first action (grid and cell actions)
            Undo/redo single action
            Undo/redo up to five actions
            Undo a redo
            Make sure range functions update with undo/redo
        
        On Key Enter
            Check that content is submitted to the grid state

-   Util
        Parsing: Basic Arithmetic
            Check every operation
            Order of operations (parenthesis)
        Parsing: SUM
            Make sure whole range is being summed
            Summing REFs and AVGs
            Summing a large rectangle of cells
            Circularity
            Updating sum when cell in range is updated
        Parsing: REF
            Basic REF
            Empty REF
            Referencing cell w SUM or AVG
            Referencing another REF
            Update REF when the reference (or reference of reference) is changed
                Both deletion and modification
        Parsing: AVG
            Basic AVG range
            AVG of SUM or REFs
            Updating AVG when cell in range is updated
        
        String Concat
            Concatenating two normal strings
            Concat multiple strings
            One string and one not ("zip" + "zap)
            Open quote(s)
            Concat with a number ("zip" + 4)




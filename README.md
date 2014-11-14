# KBB LESS

Simply watches over our KBB OOLess files and auto-compiles it.

## Installing

```
npm i -g kbb && npm i -g less
```

## Usage

```
Usage: 
    Compile KBB OOLess:
        
        kbb less

    Compile Single Less file:
        
        kbb -f /OOLess/tablet/tablet.less -o /OOLess/css/tablet.less 

Commands:

    less   watch/compile KBB OOLess

Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -f, --file [less]    Single file to watch/compile
    -o, --output [path]  Output path for single compile less
```
# KBB LESS

Simply watches over our KBB OOLess files and auto-compiles it.

## Installing

```
npm i -g kbb
```

Afterward KBB Less is install run the folowwing command

```
kbb setup
```

## Usage

```
Usage: 
    Compile KBB OOLess:
        
        kbb less

    Compile Single Less file:
        
        kbb -f /OOLess/tablet/tablet.less -o /OOLess/css/tablet.less 

Commands:

    less    watch/compile KBB OOLess
    setup   install the necessary file dependencies

Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -f, --file [less]    Single file to watch/compile
    -o, --output [path]  Output path for single compile less
```
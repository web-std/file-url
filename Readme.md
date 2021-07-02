# @wed-std/file-url

Universal library for turning file system paths into `file://` URLs. It does not
depend on other libraries nor nodejs built-ins and works just the same across
node and web without any polyfills.

### Why

This libary is intended to facilitate a more web friendly (or rather runtime
agnostic) alternative way to refer to files via URLs as opposed to node's `path`
module.

And because node's `fs` APIs accept `file://` URLs in place of paths URLs can
be used without having to going bath to paths.

## Usage

### URLs are OS agnostic

Correct file URLs are created for posix & windows paths regardless of host
runtime OS.

```js
import { fromPath } from "@wed-std/file-url"

fromPath("/Users/web-std/file-url/Readme.md").href
//> 'file:///Users/web-std/file-url/Readme.md'

fromPath("C:\\web-std\\file-url\\tscofig.json").href
//> "file:///C:/web-std/file-url/tsconfig.json"

fromPath("\\\\192.168.0.1\\share\\path\\file.txt").href
//> "file://192.168.0.1/share/path/file.txt"
```

### Resolve to base URL

You can use standard URLs to do resolution simply by passing a base URL, making
it effective alternative to node's `path.resolve` / `path.join`.

```js
new URL("baz/asdf", fromPath("/foo/bar/")).href
// file:///foo/bar/baz/asdf

new URL("../beep.txt", fromPath("/foo/bar/")).href
// file:///foo/beep.txt

new URL("/root/foo", fromPath("/foo/bar/")).href
// file:///root/foo
```

### URLs are normalized

Standard URLs are normalized out of the box so you don't really need an
equivalent of `path.normalize`.

```js
fromPath("/foo/bar/baz/asdf/quux/.././file.md").href
// file:///foo/bar/baz/asdf/file.md

new URL("/.././file.md", fromPath("/foo/bar/baz/asdf/quux/"))
// file:///foo/bar/baz/asdf/file.md
```

### Basename are straight forward

URLs do not have equivalent of `path.basename` but given that they are normalized
and use only forward slashes it's pretty straight forward:

```js
fromPath("/foo/bar.html").pathname.split("/").pop()
//> bar.html
```

### Can break free of try/catch

Sometimes surrounding logic with try / catch blocks introduces incidental
complexity. Library provides `tryFromPath` function to keep things simple
when it makes nence

```js
import { tryFromPath } from "@wed-std/file-url"

// Unlike `fromPath` invalid paths do not throw just return null.
const url = tryFromPath(foo) || tryFromPath(bar)
```

## Install

```
npm install @web-std/file-url
```

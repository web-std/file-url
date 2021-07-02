import * as FileURL from "@web-std/file-url"
import { assert } from "./test.js"

/**
 *
 * @param {import('./test').Test} test
 */
export const test = test => {
  test("invalid urls", () => {
    assert.throws(
      // @ts-expect-error
      () => FileURL.fromPath(5),
      /must be a string/
    )

    assert.equal(
      // @ts-expect-error
      FileURL.tryFromPath(5),
      null
    )

    assert.throws(() => FileURL.fromPath(""), /not a valid file path/)
    assert.equal(FileURL.tryFromPath(""), null)

    assert.throws(
      () => FileURL.fromPath("prose.txt"),
      /is not a valid absolute path/
    )
    assert.equal(FileURL.tryFromPath("prose.txt"), null)

    assert.throws(
      () => FileURL.fromPath("./foo"),
      /is not a valid absolute path/
    )
    assert.equal(FileURL.tryFromPath("./foo"), null)

    assert.throws(
      () => FileURL.fromPath("../foo/bar"),
      /is not a valid absolute path/
    )
    assert.equal(FileURL.tryFromPath("../foo/bar"), null)
  })

  test("posix paths", () => {
    assert.equal(FileURL.fromPath("/foo/bar").href, "file:///foo/bar")
    assert.equal(FileURL.fromPath("/").href, "file:///")
    assert.equal(FileURL.fromPath("/foo/bar/").href, "file:///foo/bar/")
    assert.equal(FileURL.fromPath("/foo/bar/./baz").href, "file:///foo/bar/baz")
    assert.equal(FileURL.fromPath("/foo/bar/../baz").href, "file:///foo/baz")
    assert.equal(FileURL.fromPath("/foo/bar/../../..").href, "file:///")
    assert.equal(
      FileURL.fromPath("/foo/bar/../../../boom").href,
      "file:///boom"
    )
  })

  test("windows path with drive)", () => {
    assert.equal(
      FileURL.fromPath("C:\\Users\\web-std\\file-url\\Readme.md").href,
      "file:///C:/Users/web-std/file-url/Readme.md"
    )

    assert.equal(
      FileURL.fromPath("e:\\Users\\web-std\\file-url\\Readme.md").href,
      "file:///e:/Users/web-std/file-url/Readme.md"
    )

    assert.throws(
      () => FileURL.fromPath("$:\\Users\\web-std\\file-url\\Readme.md").href,
      /is not a valid absolute path/
    )
  })

  test("window unc path", () => {
    assert.equal(
      FileURL.fromPath(String.raw`\\host\share\path\file.txt`).href,
      "file://host/share/path/file.txt"
    )

    assert.equal(
      FileURL.fromPath(String.raw`\\höst\share\path\file.txt`).href,
      `file://xn--hst-sna/share/path/file.txt`
    )

    assert.equal(
      FileURL.fromPath(String.raw`\\192.168.0.1\share\path\file.txt`).href,
      `file://192.168.0.1/share/path/file.txt`
    )

    assert.throws(
      () =>
        FileURL.fromPath(String.raw`\\192.168.0.1:8080\share\path\file.txt`),
      /Invalid URL/
    )
  })

  test("escapes", () => {
    assert.equal(
      FileURL.fromPath(`/root/Bad?/A#1.jpg`).href,
      "file:///root/Bad%3F/A%231.jpg"
    )

    assert.equal(
      FileURL.fromPath("C:\\Users\\web-std\\file-url\\Read^me.md").href,
      "file:///C:/Users/web-std/file-url/Read%5Eme.md"
    )
  })

  test("directories end with slash", () => {
    assert.equal(
      FileURL.fromPath("C:\\Users\\web-std\\file-url\\").href,
      "file:///C:/Users/web-std/file-url/"
    )
  })
}

class FileURL extends URL {
  /**
   * @type {"file:"}
   */
  get protocol() {
    return "file:"
  }
}

/**
 * Takes absolute file path and turns it into file:// URL. Throws TypeError if
 * invalid path is given. Use `tryFromPath` if you want to get `null` instead of
 * exception.
 *
 * @param {string} path
 * @returns {import('./lib').FileURL}
 */
export const fromPath = path => {
  if (typeof path !== "string") {
    return invalid("path argument must be a string")
  }

  const { length } = path
  if (path.length <= 0) {
    return invalid(`'' is not a valid file path`)
  }
  const code = path.charCodeAt(0)
  switch (code) {
    // Posix absolute path
    case CHAR_FORWARD_SLASH:
      return createFileURL(`file://${path}`)
    // Could be windows UNC path
    case CHAR_BACKWARD_SLASH:
      return path.charCodeAt(1) === CHAR_BACKWARD_SLASH
        ? createFileURL(`file:${path.replace(/\\/g, "/")}`)
        : invalid(`'${path}' is not a valid absolute path`)
    // Could be window absolute path
    default:
      const isValid =
        length > 2 &&
        isWindowsDeviceRoot(code) &&
        path.charCodeAt(1) === CHAR_COLON &&
        path.charCodeAt(2) === CHAR_BACKWARD_SLASH
      return isValid
        ? createFileURL(`file:///${path.replace(/\\/g, "/")}`)
        : invalid(`'${path}' is not a valid absolute path`)
  }
}

/**
 *
 * @param {string} path
 */
export const tryFromPath = path => {
  try {
    return fromPath(path)
  } catch (_) {
    return null
  }
}

/**
 * @param {string} reason
 * @returns {never}
 */
const invalid = reason => {
  throw new TypeError(`Failed to construct 'URL': ${reason}`)
}

/**
 * @param {string} url
 */
const createFileURL = url => new FileURL(escapeFileURL(url))

/**
 * Escape required characters for path components.
 * @see https://tools.ietf.org/html/rfc3986#section-3.3
 * @param {*} uri
 * @returns {string}
 */
const escapeFileURL = uri => encodeURI(uri).replace(/[?#]/g, encodeURIComponent)

const CHAR_FORWARD_SLASH = "/".charCodeAt(0)
const CHAR_BACKWARD_SLASH = "\\".charCodeAt(0)
const CHAR_COLON = ":".charCodeAt(0)
const CHAR_UPPERCASE_A = "A".charCodeAt(0)
const CHAR_LOWERCASE_A = "a".charCodeAt(0)
const CHAR_LOWERCASE_Z = "z".charCodeAt(0)
const CHAR_UPPERCASE_Z = "Z".charCodeAt(0)

/**
 * @param {number} code
 */

const isWindowsDeviceRoot = code =>
  (code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z) ||
  (code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z)

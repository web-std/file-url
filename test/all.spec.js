import { test } from "./test.js"
import { test as libTest } from "./lib.spec.js"

libTest(test)
test.run()

## Table of Contents
- [Configuration](./Configuration.md)
- [Project Structure](./project_structure.md)
- [Contributing](./CONTRIBUTING.md)
- [Demo Code](#demo-code)

# Demo Code
As a demo application, Haztrak contains code that is, intentionally, not meant for production (i.e., code that shows off features while deployed locally). If anyone ever imagines doing something with this source, they should probably adjust this parts.

All demo code is marked with comments beginning with `Begin HT demo` and `End HT demo`. The Demo code will often only run if the [REACT_APP_HT_ENV](./Configuration.md#client) environment varible is set to `local`
```typescript
// Begin HT demo
// Brief Explanation
someDemoFn()
// commented out ProdFn()
// End HT demo

```

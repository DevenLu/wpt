// META: global=window,worker
// META: script=/wasm/jsapi/assertions.js

const invalidContentTypes = [
  "",
  "application/javascript",
  "application/octet-stream",
  "text/wasm",
  "application/wasm;",
  "application/wasm;x",
  "application/wasm;charset=UTF-8",
];

for (const contenttype of invalidContentTypes) {
  promise_test(t => {
    const response = fetch(`/wasm/incrementer.wasm?pipe=header(Content-Type,${encodeURIComponent(contenttype)})`);
    return promise_rejects_js(t, TypeError, WebAssembly.compileStreaming(response));
  }, `Response with Content-Type ${format_value(contenttype)}: compileStreaming`);

  promise_test(t => {
    const response = fetch(`/wasm/incrementer.wasm?pipe=header(Content-Type,${encodeURIComponent(contenttype)})`);
    return promise_rejects_js(t, TypeError, WebAssembly.instantiateStreaming(response));
  }, `Response with Content-Type ${format_value(contenttype)}: instantiateStreaming`);
}

const validContentTypes = [
  "application/wasm",
  "APPLICATION/wasm",
  "APPLICATION/WASM",
];

for (const contenttype of validContentTypes) {
  promise_test(async t => {
    const response = fetch(`/wasm/incrementer.wasm?pipe=header(Content-Type,${encodeURIComponent(contenttype)})`);
    const module = await WebAssembly.compileStreaming(response);
    assert_equals(Object.getPrototypeOf(module), WebAssembly.Module.prototype,
                  "prototype");
  }, `Response with Content-Type ${format_value(contenttype)}: compileStreaming`);

  promise_test(async t => {
    const response = fetch(`/wasm/incrementer.wasm?pipe=header(Content-Type,${encodeURIComponent(contenttype)})`);
    const result = await WebAssembly.instantiateStreaming(response);
    assert_WebAssemblyInstantiatedSource(result);
  }, `Response with Content-Type ${format_value(contenttype)}: instantiateStreaming`);
}

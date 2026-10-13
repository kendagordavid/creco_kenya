import assert from "node:assert/strict";
import test from "node:test";
import { parseAnswer } from "./answer-format.ts";

test("numbered items separated by blank lines stay one list in source order", () => {
  const blocks = parseAnswer(`Here are the reasons:\n\n1. First reason\n\n1. Second reason\n\n1. Third reason\n`);
  assert.deepEqual(
    blocks.map((block) => (block.type === "ordered" ? block.items : block.type)),
    ["paragraph", ["First reason", "Second reason", "Third reason"]],
  );
});

test("a compact 1. 2. 3. list stays in that order", () => {
  const blocks = parseAnswer("1. Alpha\n2. Beta\n3. Gamma");
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0]?.type, "ordered");
  if (blocks[0]?.type === "ordered") {
    assert.deepEqual(blocks[0].items, ["Alpha", "Beta", "Gamma"]);
  }
});

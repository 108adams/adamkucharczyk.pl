import {readFileSync} from 'node:fs';

const pattern = /^(feat|fix|refactor|test|docs|style|chore)(\([\w-]+\))?!?: .{1,72}$/;
const merge = /^(Merge|Revert) /;
const subject = readFileSync(process.argv[2], 'utf8').split('\n')[0];

if (!pattern.test(subject) && !merge.test(subject)) {
  console.error(
    `Commit subject must match "type(scope): subject" (feat|fix|refactor|test|docs|style|chore), max 72 chars.\nGot: ${subject}`
  );
  process.exit(1);
}

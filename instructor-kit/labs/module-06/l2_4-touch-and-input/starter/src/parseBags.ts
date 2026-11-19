// Task 2: a text field always gives a string, even with the number keyboard. Turn what was typed into a count:
//   ''  -> 0 (nothing typed yet)      '12' or ' 12 ' -> 12      anything that is not only digits -> null
// Number(text) is the quick web habit: what does it give for '3a', and for '-1'?
export function parseBags(text: string): number | null {
  return Number(text);
}

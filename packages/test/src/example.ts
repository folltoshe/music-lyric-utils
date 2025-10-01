export default {
  original: `
[00:00.100]original 1
[00:10.100]original 2
`,
  dynamic: `
[00:00.100]<0,100>dynamic <100,100>1<200,100>
[00:10.100]<0,100>dynamic <100,100>2<200,100>
`,
  translate: `
[00:00.100]translate 1
[00:9.100]translate 2
`,
  roman: `
[00:00.100]roman 1
[00:12.100]roman 2
`,
}

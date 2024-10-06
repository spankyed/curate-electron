export function pdfText(text: any) {
return `
[pdf]
${text}

[/pdf]

Do not include markdown in your response.
`
}
import DatauriParser from 'datauri/parser.js'
const parser = new DatauriParser()

export const dataUri = (file) => parser.format('jpeg',file.buffer)

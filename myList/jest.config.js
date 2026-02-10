module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  // Isso garante que o Jest ignore o processamento de node_modules,
  // mas entenda seus arquivos de teste
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

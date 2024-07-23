const fsPromises = require("fs").promises;

const appendTranslationPrefix = async (translationArguments
) => {
  const content = await readInputFileData(translationArguments.inputFilePath);
  await writeOutputFile(content, translationArguments);
};

const readInputFileData = async (inputFilePath) => {
  try {
    return fsPromises.readFile(inputFilePath, "utf8");
  } catch (error) {
    throw new Error("Error reading the input JSON file:", error);
  }
};

const writeOutputFile = async (content, translationArguments) => {
  const {prefix, outputFilePath, language} = translationArguments

  try {
    const jsonContent = JSON.parse(content);
    const modifiedData = modifyJSON(jsonContent, prefix);

    await fsPromises.truncate(outputFilePath, 0);

    await fsPromises.writeFile(
      outputFilePath,
      JSON.stringify(modifiedData, null, 2),
      "utf8"
    );
    console.log(`${language} translation is complete.`);
  } catch (error) {
    throw new Error("Error parsing the input JSON:", error);
  }
};

const modifyJSON = (data, prefix) => {
  for (const key in data) {
    if (data[key].startsWith(prefix)) {
      continue;
    }

    data[key] = `${prefix}${data[key]}`;
  }

  return data;
};

// Absolute path of the translations directory
const translationsPath = '/Users/manikandanchinnadurai/manikandan/Projects/ITZ-Bund/ITZ-Bund/ai-assistance-platform/aiap-applications/portal/client/src/assets/i18n/'
const translationArgumentsCollection = [
  {
    language: 'GB',
    inputFilePath: `${translationsPath}/en-US.json`,
    prefix: "[GB] ",
    outputFilePath: `${translationsPath}/en-GB.json`,
  },
  {
    language: 'DE',
    inputFilePath: `${translationsPath}/en-US.json`,
    prefix: "[DE] ",
    outputFilePath: `${translationsPath}/de-DE.json`,
  },
];

const appendTranslationsPromises = translationArgumentsCollection.map((translationArguments) =>
  appendTranslationPrefix(
      translationArguments
  )
);

const appendTranslations = async () => {
  await Promise.all(appendTranslationsPromises);
};

appendTranslations().catch((error) => console.error(error));

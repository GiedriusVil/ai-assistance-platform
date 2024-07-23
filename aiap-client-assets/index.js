

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');
const path = require('path');
const convert = require('xml-js');

const { JSONPath } = require('@ibm-aca/aca-wrapper-jsonpath-plus');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const iconByCellXml = (xml) => {
  const RET_VAL = {};
  const SVG_ELEMENT = xml?.elements.find((item) => {
    return 'svg' === item?.name;
  });
  const SVG_STRING = convert.json2xml(JSON.stringify({
    type: 'element',
    name: 'div',
    elements: [SVG_ELEMENT]
  }));
  const NAME_ELEMENT = xml?.elements.find((item) => {
    const tmpNameElement = item?.elements.find((tmpItem) => {
      return 'text' === tmpItem?.type && tmpItem?.text?.includes('name');
    });
    let retVal = 'div' === item?.name && tmpNameElement;
    return retVal;
  });
  const SIZE_ELEMENT = xml?.elements.find((item) => {
    const tmpNameElement = item?.elements.find((tmpItem) => {
      return 'text' === tmpItem?.type && tmpItem?.text?.includes('size');
    });
    let retVal = 'div' === item?.name && tmpNameElement;
    return retVal;
  });
  let size = JSONPath({
    path: '$.elements[?(@.type == "element")].elements[*].text',
    json: SIZE_ELEMENT,
  });
  let name = JSONPath({
    path: '$.elements[?(@.type == "element")].elements[*].text',
    json: NAME_ELEMENT,
  });
  size = ramda.path([0], size);
  name = ramda.path([0], name);
  RET_VAL.svg = SVG_STRING;
  RET_VAL.size = size;
  RET_VAL.name = `${name}.svg`;
  return RET_VAL;
}

const appendIconsByRowXml = (target, xml) => {
  for (let cell of xml.elements) {
    let icon = iconByCellXml(cell);
    if (
      !lodash.isEmpty(icon?.svg) &&
      !lodash.isEmpty(icon?.size) &&
      !lodash.isEmpty(icon?.name)
    ) {
      if (
        lodash.isEmpty(target[icon.name])
      ) {
        target[icon.name] = {}
      }
      target[icon.name][icon.size] = icon.svg;
    }
  }
}

const parseIconsMapFromXML = (xml) => {
  const RET_VAL = {};
  let tmpXml = xml.elements[0];
  for (let row of tmpXml.elements) {
    appendIconsByRowXml(RET_VAL, row);
  }
  return RET_VAL;
}

const execute = async () => {
  const XML_RAW = await fsExtra.readFile(path.join(__dirname, 'tmp.html'));
  const XML_PARSED = convert.xml2json(XML_RAW.toString());
  const ICONS_MAP = parseIconsMapFromXML(JSON.parse(XML_PARSED));
  const DIR = path.join(__dirname, 'carbon-icons');
  const PATHS = await fsExtra.readdir(DIR);
  for (let pathSize of PATHS) {
    if (
      '.DS_Store' !== pathSize
    ) {
      const DIR_SIZE = path.join(__dirname, `carbon-icons/${pathSize}`);
      const PATHS_SIZE_TOPIC = await fsExtra.readdir(DIR_SIZE);
      for (let pathSizeTopic of PATHS_SIZE_TOPIC) {
        const DIR_SIZE_TOPIC = path.join(__dirname, `carbon-icons/${pathSize}/${pathSizeTopic}`);
        const PATS_SIZE_TOPIC_ICON = await fsExtra.readdir(DIR_SIZE_TOPIC);
        for (let TMP_ICON of PATS_SIZE_TOPIC_ICON) {
          let icon = ICONS_MAP[TMP_ICON];
          if (
            icon
          ) {
            let svg = icon[pathSize]
            if (
              !lodash.isEmpty(svg)
            ) {
              fsExtra.writeFileSync(
                path.join(__dirname, `carbon-icons/${pathSize}/${pathSizeTopic}/${TMP_ICON}`),
                svg
              );
            }
          }
        }
      }
    }
  }








  // console.log(ICONS_MAP);
}


execute();

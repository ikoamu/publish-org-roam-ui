console.log("db file", process.argv[2]);

const sqlite3 = require('sqlite3').verbose();
const dbFile = process.argv[2];
const db = new sqlite3.Database(dbFile);
const fs = require('fs');

/**
 * Parses the string of properties and returns an object containing the key-value pairs.
 * If the key is 'FILE', the corresponding value is processed to extract the filename.
 * @param {string} s - The string of properties.
 * @returns {Object} - The object containing the parsed properties.
 */
function parseProperties(s) {
  const properties = {};
  s.match(/\"(.*?)\" \. \"(.*?)\"/g).forEach(match => {
    const [key, value] = match.match(/\"(.*?)\"/g).map(v => v.replace(/"/g, ''));
    properties[key] = key === 'FILE' ? getFilename(value) : value;
  });
  return removeQuotesFromObject(properties);
}

/**
 * Removes the double quotes from the object.
 * @param {Object} obj - The object to be processed.
 * @returns {Object} - The object without double quotes.
 */ 
function removeQuotesFromObject(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].replace(/^"|"$/g, '');
    } else if (typeof obj[key] === 'object') {
      obj[key] = removeQuotesFromObject(obj[key]);
    }
  }
  return obj;
}

/**
 * Extracts the filename from the path.
 * @param {string} path - The path to be processed.
 * @returns {string} - The filename.
 */
function getFilename(path) {
  return path.split('/').pop();
}

const queryNodes = `
SELECT
  GROUP_CONCAT(tags.tag) AS tags, 
  nodes.properties,
  nodes.olp,
  nodes.pos,
  nodes.level,
  nodes.title,
  nodes.file,
  nodes.id
FROM
  nodes
LEFT JOIN
  tags
ON
  nodes.id = tags.node_id
GROUP BY
  nodes.id
`;

const queryIdLinks = `
SELECT
  type,
  dest as target,
  source
FROM
  links
WHERE
  type = '"id"'
`;

const queryCites = `
SELECT
  citations.node_id as citeNodeId,
  citations.cite_key as citeKey,
  refs.node_id as refNodeId
FROM
  citations
LEFT JOIN refs ON citations.cite_key = refs.ref
`

const queryTags = `
SELECT
  tags.tag
FROM
  tags
GROUP BY
  tags.tag
`;

const graphdata = {
  type: "graphdata",
  data: {},
};
db.all(queryNodes, (_, nodes) => 
  db.all(queryIdLinks, (_, links) => 
    db.all(queryCites, (_, cites) =>
      db.all(queryTags, (_, tags) => {
        graphdata.data.nodes = nodes.map(node => {
          const splitTags = node.tags?.split(',') ?? [null];
          const olp = node.olp?.replace(/\(\"|\"\)/g, '').split(' ') ?? null;
          return{
            ...node,
            olp,
            tags: splitTags,
            file: getFilename(node.file),
            properties: parseProperties(node.properties),
          };
        });
        graphdata.data.links = [
          ...links,
          ...cites.map(cite => cite.refNodeId ? ({
              type: 'ref',
              source: cite.citeNodeId,
              target: cite.refNodeId,
            }) : ({
              type: 'cite',
              source: cite.citeNodeId,
              target: cite.citeKey,
            })),
        ];
        graphdata.data.tags = tags.length ? tags.map(t => t.tag) : null;
        
        fs.writeFile('graphdata.json', JSON.stringify(removeQuotesFromObject(graphdata)), (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
      }),
    )
  ),
);

db.close();

import fs from 'fs';
import { unified }  from 'unified';
import uniorgParse from 'uniorg-parse';
import { toString } from 'orgast-util-to-string';

fs.readFile('graphdata.json', 'utf8', (_, data) => {
  const graphdata = JSON.parse(data);
  const nodes = graphdata.data.nodes; 
  const processer = unified().use(uniorgParse);
  const searchData = [];

  fs.readdir('notes', (_, files) => {
    files.forEach(file => {
      const org = fs.readFileSync(`notes/${file}`, 'utf8');
      const tree = processer.parse(org);
      const filtered = tree.children.filter(
        node => node.type !== 'property-drawer' && node.type !== 'keyword'
      );
      const content = toString({
        ...tree,
        children: filtered,
      });
      const node = nodes.find(n => n.id === file);
      if (node) {
        searchData.push({
          id: node.id,
          title: node.title,
          tags: node.tags[0] ? node.tags : null,
          content,
        });
      }
    });
    fs.writeFile('searchdata.json', JSON.stringify(searchData), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  });
});


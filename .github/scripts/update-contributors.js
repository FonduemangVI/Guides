const axios = require('axios');
const fs = require('fs');

// Indentation function
function indentString(string, indentation) {
  return string.split('\n').map(line => indentation + line).join('\n');
}

let contributors = '<div style="display: flex; flex-wrap: wrap;">\n';
let index = 0;
let page = 1;

function fetchPage() {
  axios.get(`https://api.github.com/repos/FonduemangVI/Guides/contributors?per_page=100&page=${page}`)
    .then((response) => {
      if (response.data.length === 0) {
        // No more contributors, write the file
        contributors += '</div>\n';
        contributors = indentString(contributors, '');

        fs.writeFileSync('CONTRIBUTORS.md', `## Contributors\n\n<!-- readme: contributors -start -->\n${contributors}\n<!-- readme: contributors -end -->\n`);
        return;
      }

      response.data.forEach((user) => {
        // Exclude bots and actions-user
        if (user.type === 'Bot' || user.login.toLowerCase().includes('bot') || user.login === 'actions-user' || user.login === 'mynameisbogdan') return;

        const userHtml = `
<div style="flex: 1 1 20%; background-color: #${(index % 2 === 0) ? '2c2c54' : '3d3d6b'}; padding: 10px; text-align: center;">
  <img src="${user.avatar_url}&v=4" style="width: 50px; border-radius: 50%;" alt="${user.login}"/>
  <br />
  <b><a href="${user.html_url}" style="color: #ffa500;">${user.login}</a></b>
</div>`;

        contributors += indentString(userHtml, '    ');

        index++;
      });

      // Fetch the next page
      page++;
      fetchPage();
    })
    .catch((error) => {
      console.error(`Could not fetch contributors: ${error}`);
    });
}

fetchPage();

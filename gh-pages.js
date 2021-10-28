var ghpages = require('gh-pages');

ghpages.publish(
    '/public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/BrandonTing/svelte-teambuilder.git', // Update to point to your repository
        user: {
            name: 'BrandonTing', // update to use your name
            email: 'brandon1221t@gmail.com' // Update to use your email
        },
        dotfiles: true
    },
    () => {
        console.log('Deploy Complete!');
    }
);

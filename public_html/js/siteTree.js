export const siteTree = {
    name: 'root',
    type: 'folder',
    children: [
        {
            name: 'Projects',
            type: 'folder',
            children: [
                { name: 'Mutual Learning', type: 'file', url: './mutuallearning.html' },
                { name: 'This Site', type: 'file', url: './thissite.html' },
            ]
        },

        {
            name: 'About Me',
            type: 'folder',
            children: [
                { name: 'About Main', type: 'file', url: './fake.html' }
            ]
        }
    ]
};

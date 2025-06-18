export const siteTree = {
    name: 'root',
    type: 'folder',
    children: [
        { name: 'Fake', type: 'file', url: './fake.html' },
        { name: 'Mutual Learning', type: 'file', url: './mutuallearning.html' },
        { name: 'This Site', type: 'file', url: './thissite.html' },
        {
            name: 'Isaac',
            type: 'folder',
            children: [
                { name: 'Isaac Main', type: 'file', url: './isaac/public_html/index.html' }
            ]
        }
    ]
};

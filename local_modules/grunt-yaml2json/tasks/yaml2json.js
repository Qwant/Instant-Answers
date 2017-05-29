const YAML = require('js-yaml');
const read = path => require('fs').readFileSync(path, 'utf8');

module.exports = function (grunt, options)
{
    function yaml2json(src, dest)
    {
        const content = read(src);
        const data = YAML.load(content);
        const json = JSON.stringify(data);
        return grunt.file.write(dest, json, options);
    }

    function unixpath(path)
    {
        return process.platform === 'win32' ? path.replace(/\\/g, '/') : path;
    }

    grunt.registerMultiTask('yaml2json', 'Convert files from YAML to JSON.', function ()
    {
        this.files.forEach(function (file)
        {
            const src = unixpath(file.src[0]);
            const dest = unixpath(file.dest);
            if (!grunt.file.exists(src))
            {
                return grunt.fail.warn("No such file: " + src);
            }
            else
            {
                grunt.log.writeln(src + " -> " + dest);
                return yaml2json(src, dest);
            }
        });
    });
};
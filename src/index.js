import path from "path";
import fs from "fs";

const FindLongestCommonPath = (entries) => {
    let commonIndex = -1;
    if (entries.length === 0) return '';
    const paths = entries.map(entry => entry.split(path.sep));
    if (paths.some(path => path.length === 0) || paths.some(path => path[0] !== paths[0][0])) {
        // no common path
    } else {
        for (let i = 0; i < paths[0].length; i++) {
            if (path.some(path[i] !== path[0][i])) {
                break;
            }
            commonIndex = i;
        }
    }
    return commonIndex === -1 ? '' : paths[0].slice(0, commonIndex + 1).join(path.sep);
}

const externalPlugin = () => {
    const cssFiles = [];
    const inputDirs = [];
    return {
        name: 'external-plugin',
        options(options) {
            const { input } = options
            if (typeof input === 'string') {
                inputDirs.push(path.dirname(input))
            } else {
                //todo object or array
            }
        },
        resolveId(source) {
            if (source.endsWith('.css')) {
                return {
                    id: source,
                    external: true
                }
            }
        },
        generateBundle(opts){
            let {preserveModulesRoot} = opts
            if(!preserveModulesRoot){
                preserveModulesRoot = path.join(process.cwd(), FindLongestCommonPath(inputDirs))
            }
            cssFiles.forEach(file=>{
                this.emitFile({
                    fileName: path.relative(preserveModulesRoot, file),
                    type: 'asset',
                    source: fs.readFileSync(file, 'utf-8')
                })
            })
        }
    }
}

export default externalPlugin;
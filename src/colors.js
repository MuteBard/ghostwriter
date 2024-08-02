const color = {
    'PINK': 'pink',
    'RED': 'red',
    'ORANGE': 'orange',
    'YELLOW': 'yellow',
    'LIME': 'lime',
    'GREEN': 'green',
    'CYAN': 'cyan',
    'BLUE': 'blue',
    'MAGENTA': 'magenta',
    'WHITE': 'white',
    'PURPLE': 'purple',
    'BROWN': 'brown',
    'TEAL': 'teal',
    'INDIGO': 'indigo',
    'CRIMSON': 'crimson',
    'MINT': 'mint',
    'CORAL': 'coral'
};

function getColor(color, opacity){
    let value = ''
    switch (color){
        case 'red' :
            value = `rgba(255, 0, 0, ${opacity})`;
            break;
        case 'green' :
            value =  `rgba(0, 0, 255, ${opacity})`;
            break;
        case 'blue' :
            value = `rgba(0, 0, 255, ${opacity})`;
            break;
        case 'white' :
            value = `rgba(255, 255, 255, ${opacity})`;
            break;
        case 'pink' :
            value = `rgba(255, 192, 203, ${opacity})`;
            break;
        case 'orange' :
            value = `rgba(255, 165, 0, ${opacity})`;
            break;
        case 'yellow' :
            value = `rgba(255, 255, 0, ${opacity})`;
            break;
        case 'lime' :
            value = `rgba(191, 255, 0, ${opacity})`;
            break;
        case 'cyan' :
            value = `rgba(0, 255, 255, ${opacity})`;
            break;
        case 'magenta' :
            value = `rgba(255, 0, 255, ${opacity})`;
            break;
        case 'purple' :
            value = `rgba(128, 0, 128, ${opacity})`;
            break;
        case 'brown' :
            value = `rgba(165, 73, 42, ${opacity})`;
            break;
        case 'teal' :
            value = `rgba(0, 128, 128, ${opacity})`;
            break;
        case 'mint' :
            value = `rgba(62, 180, 137, ${opacity})`;
            break;
        case 'coral' :
            value = `rgba(255, 127, 80, ${opacity})`;
            break;
        case 'crimson' :
            value = `rgba(220, 20, 60, ${opacity})`;
            break;
        case 'indigo' :
            value = `rgba(75, 0, 130, ${opacity})`;
            break;
        case 'cerulean' :
            value = `rgba(0, 123, 167, ${opacity})`;
        default:
            value = `rgba(0, 0, 0, ${opacity})`;
    }
    return value;
}

exports.getColor = getColor;
exports.color=color
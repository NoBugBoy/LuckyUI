let GC =  getColor(type){
    switch (type) {
        case 'string' : return '#7FFFD4';
        case 'integer' : return '#DC143C';
        case 'object' : return '#6495ED';
        case 'array' : return '#7FFFD4';
        case 'number' : return '#DC143C';
        case 'boolean' : return '#6495ED';
        case 'items' : return '#6495ED';
        default return '#6495ED';
    }
}

export default GC;
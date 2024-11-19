function dataFormat (data) {
    const dataSplit = data.split('');
    const newDataArray = [dataSplit[8], dataSplit[9], ".", dataSplit[5], dataSplit[6], ".", dataSplit[0], dataSplit[1], dataSplit[2], dataSplit[3] ]
    return newDataArray.join('')
   
}

export default dataFormat;
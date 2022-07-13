import GridPixel from './GridPixel.js'

const GridColumn = ({xIndex, columnData, setPixelColor}) => {
    // console.log(columnData)
    return (
        <div style={{width:50, float: "left"}}>
            {
                columnData.map((pixelColor, yIndex) => {
                    return <GridPixel xIndex={xIndex} yIndex={yIndex} pixelColor={pixelColor} setPixelColor = {setPixelColor}/>
                })
            }
        </div>
    )
}

export default GridColumn
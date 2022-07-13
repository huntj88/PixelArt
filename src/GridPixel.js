
const GridPixel = ({xIndex, yIndex, pixelColor, setPixelColor}) => {
    const styles = {
        border: '1px solid rgba(0, 0, 0, 0.05)', 
        height:50, 
        width:50, 
        backgroundColor: pixelColor
    };
    return (
        <div style={styles} onClick={() => setPixelColor(xIndex, yIndex, "black")} />
    )
}

export default GridPixel
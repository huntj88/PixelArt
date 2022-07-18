import GridPixel from "./GridPixel";

const GridColumn = ({
  pixelMapState,
  xIndex,
  pixelSelected,
  users,
  onMouseOverPixel,
}) => {
  return (
    <div style={{ width: 27, float: "left" }}>
      {[...range(0, 25)].map((yIndex) => {
        return (
          <GridPixel
            pixelMapState={pixelMapState}
            xIndex={xIndex}
            yIndex={yIndex}
            pixelSelected={pixelSelected}
            users={users}
            onMouseOverPixel={onMouseOverPixel}
          />
        );
      })}
    </div>
  );
};

const range = (start, end, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

export default GridColumn;

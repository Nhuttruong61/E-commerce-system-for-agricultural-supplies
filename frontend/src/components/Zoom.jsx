import React from "react";
import ReactImageMagnify from "react-image-magnify";
function Zoom({ image }) {
  return (
    <div className="w-[240px]">
      <div className="object-contain">
        <ReactImageMagnify
          {...{
            smallImage: {
              alt: "Wristwatch by Ted Baker London",
              isFluidWidth: true,
              src: image,
            },
            largeImage: {
              src: image,
              width: 728,
              height: 728,
            },
            enlargedImageContainerDimensions: {
              width: "200%",
              height: "100%",
              backgroundColor: "white",
            },
          }}
        />
      </div>
    </div>
  );
}

export default Zoom;

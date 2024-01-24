import React, { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Maya } from "./game";
import { PostError } from "./game/modules/manager/utils/postFetch";
import { notify } from "./game/utils/notify";

function App() {
  const [canvasWrapper, setCanvasWrapper] = useState<HTMLDivElement | null>();
  const game = useRef<Maya>();

  const onError = (error: PostError) => {
    notify({ type: "error", message: error.message || "" });
    console.log("error", error);
  };

  useEffect(() => {
    if (canvasWrapper) {
      game.current = new Maya({
        canvasWrapper,
        options: {
          onError,
        },
      });
    }
    return () => {
      game.current?.destroy();
    };
  }, [canvasWrapper]);

  return (
    <div>
      <div ref={setCanvasWrapper} className="canvasWrapper"></div>
      <ToastContainer />
    </div>
  );
}

export default App;

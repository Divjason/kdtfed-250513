import { useState, useEffect } from "react";
import GlobalStyles from "./styles/GlobalStyles.styles";
import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { auth } from "./firebase";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <GlobalStyles />
      {isLoading ? <div>Loading...</div> : <RouterProvider router={router} />}
    </>
  );
};

export default App;

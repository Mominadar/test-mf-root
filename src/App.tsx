
import { useReactToPrint } from 'react-to-print';
import './App.css'
import React, { useCallback, useRef, useState } from 'react';

//@ts-ignore
const RemoteComponent = React.lazy(() => import('remoteComponent/RemoteComponent'));

function App() {

  const componentRef = useRef(null);
  const [load, setLaod] = useState(false);
  const handleAfterPrint = useCallback(() => {
    console.log("Certificate Printed.");
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("Printing Certificate...");
    return Promise.resolve();
  }, []);

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `root`,
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  return (
    <>
      <h1 ref={componentRef}>Root Component</h1>
      <p className="read-the-docs">
        Root component content
      </p>
      <button onClick={printFn}>print</button>
      <button onClick={()=>{
        setLaod(true);
      }}>load remote</button>

      {load && <RemoteComponent/>}
    </>
  )
}

export default App

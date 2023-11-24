import { useEffect, useRef } from 'react';


export default function App() {
  const text = useRef('')

  useEffect(() => {
    (async () => {
      const Stackedit = (await import('stackedit-js')).default;
      console.log(Stackedit);
      
      const stackedit = new Stackedit();

      // Open the iframe
      stackedit.openFile({
        name: 'Filename', // with an optional filename
        content: {
          text: text.current, // and the Markdown content.
        }
      });

      // Listen to StackEdit events and apply the changes to the textarea.
      stackedit.on('fileChange', (file) => {
        text.current = file.content.text
      });
    })()
  }, [])

  return (<>

  </>
  )
}

import { useEffect, useState } from 'react';
import { atom, useAtom } from 'jotai';

const pagesListening = atom({});

const SocketListener = ({ eventName, handleEvent, id = '' }) => {
  const [listeningPages, setListeningPages] = useAtom(pagesListening);

  useEffect(() => {
    const eventHandler = (_event, eventData) => {
      handleEvent(eventData);
    };

    if (!id || !listeningPages[id]) {
      // If no ID is provided or the ID hasn't been registered yet, add the listener
      window.socket.on(eventName, eventHandler as any);

      if (id) {
        setListeningPages((prevPages) => ({
          ...prevPages,
          [id]: true,
        }));
      }
    }

    return () => {
      if (!id) {
        window.socket.off(eventName, eventHandler as any);
      }
    };
  }, []);

  return null;
};

export default SocketListener;

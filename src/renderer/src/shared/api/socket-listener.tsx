import { useEffect, useState } from 'react';
import { socket } from './fetch';
import { atom, useAtom } from 'jotai';

const pagesListening = atom({});

const SocketListener = ({ eventName, handleEvent, id = '' }) => {
  const [listeningPages, setListeningPages] = useAtom(pagesListening);

  useEffect(() => {
    const eventHandler = (eventData) => {
      handleEvent(eventData);
    };

    if (!id || !listeningPages[id]) {
      // If no ID is provided or the ID hasn't been registered yet, add the listener
      console.log('on: ');
      socket.on(eventName, eventHandler);

      if (id) {
        setListeningPages((prevPages) => ({
          ...prevPages,
          [id]: true,
        }));
      }
    }

    return () => {
      if (!id) {
        socket.off(eventName, eventHandler);
      }
    };
  }, [eventName, handleEvent]);

  return null;
};


export default SocketListener;

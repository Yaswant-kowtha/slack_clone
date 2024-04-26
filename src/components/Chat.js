import Header from "./Header";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from 'react';

import { listenToCollectionChanges, addDocument } from "../utils/firebase";
const Chat = () => {
  const user = useSelector((store) => (store.user));
  const [documents, setDocuments] = useState([]);
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const unsubscribe = listenToCollectionChanges('users', (updatedDocuments) => {
      setDocuments(updatedDocuments);
    });

    return () => {
      unsubscribe(); 
    };
  }, []);


  const handleAddDocument = async () => {
    try {
      const docId = await addDocument('users', {
        text: newMessage,
        user: user[2],
        timestamp: new Date().getTime()
      });
      setNewMessage("")
      console.log("Document added with ID: ", docId);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };


    return (
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex justify-center items-center flex-col space-y-5 p-5">
            <div className="text-center text-xl font-bold">
              Made for people. Built for productivity.
            </div>
            <div className="bg-gray-100 rounded-lg p-4 w-full max-w-lg">
              <h2 className="text-lg font-semibold mb-2">Chat Room</h2>
              <div className="space-y-2">
                {documents.map((mesg, index) => (
                  <div key={index} className={`flex ${mesg.user === user[2] ? 'flex-row-reverse' : 'flex-row'} bg-gray-200 p-2`}>
                    <div className={`flex flex-col ${mesg.user === user[2] ? 'items-end' : 'items-start'}`}>
                      <span className="font-bold">{mesg.user}</span>
                      <span>{mesg.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleAddDocument}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      );
};

export default Chat;

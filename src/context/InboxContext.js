import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const InboxContext = createContext();

export function InboxProvider({ children }) {
  const [messages, setMessages] = useLocalStorage("domusrd-messages", []);

  const sendMessage = ({ fromId, fromName, toId, toName, propertyId, propertyTitle, text }) => {
    const msg = {
      id: Date.now(),
      fromId,
      fromName,
      toId,
      toName,
      propertyId,
      propertyTitle,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [msg, ...prev]);
    return msg;
  };

  const markAsRead = (id) => {
    setMessages((prev) =>
      prev.map((m) => m.id === id ? { ...m, read: true } : m)
    );
  };

  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const getInbox = (userId) =>
    messages.filter((m) => m.toId === userId);

  const getSent = (userId) =>
    messages.filter((m) => m.fromId === userId);

  const getUnreadCount = (userId) =>
    messages.filter((m) => m.toId === userId && !m.read).length;

  return (
    <InboxContext.Provider value={{
      messages, sendMessage, markAsRead,
      deleteMessage, getInbox, getSent, getUnreadCount,
    }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  return useContext(InboxContext);
}
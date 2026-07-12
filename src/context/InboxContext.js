import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const API_URL    = process.env.REACT_APP_API_URL || "http://localhost:5000";
const getToken   = () => localStorage.getItem("domusrd-token");
const InboxContext = createContext();

export function InboxProvider({ children }) {
  const [messages,       setMessages]       = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [unreadCount,    setUnreadCount]    = useState(0);
  const socketRef = useRef(null);

  // ── FETCH ──────────────────────────────────────────────────────────────────
  const fetchMessages = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoadingMessages(true);
    try {
      const res  = await fetch(`${API_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const normalized = data.messages.map((m) => ({
        id:            m.id,
        fromId:        m.fromId,
        fromName:      m.from?.name  || "Usuario",
        toId:          m.toId,
        toName:        m.to?.name    || "Usuario",
        propertyId:    m.propertyId,
        propertyTitle: m.property?.title || "",
        text:          m.text,
        replyToId:     m.replyToId,
        createdAt:     m.createdAt,
        read:          m.read,
      }));
      setMessages(normalized);
    } catch (err) {
      console.error("fetchMessages error:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Calcular no leídos
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    // Extraer userId del token
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const myId    = payload.id || payload.userId;
      const count   = messages.filter((m) => m.toId === myId && !m.read).length;
      setUnreadCount(count);
    } catch {}
  }, [messages]);

  // ── WEBSOCKET ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = io(API_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 2000,
    });

    // Nuevo mensaje entrante — agregarlo al estado inmediatamente
    socket.on("new_message", (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) return prev;
        return [msg, ...prev];
      });
      setUnreadCount((n) => n + 1);
      // Notificación del navegador
      if (Notification.permission === "granted") {
        new Notification(`Nuevo mensaje de ${msg.fromName}`, {
          body: msg.text,
          icon: "/favicon.ico",
        });
      }
    });

    // Confirmación de mensaje enviado (reemplaza el temporal)
    socket.on("message_sent", (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) return prev;
        // Reemplazar el temp si existe
        const withoutTemp = prev.filter((m) => !m.id.startsWith("temp-"));
        return [msg, ...withoutTemp];
      });
    });

    socketRef.current = socket;
    return () => { socket.disconnect(); socketRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── PEDIR PERMISO NOTIFICACIONES ───────────────────────────────────────────
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // ── ENVIAR ─────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async ({ fromId, fromName, toId, toName, propertyId, propertyTitle, text, replyToId = null }) => {
    const token = getToken();
    const tempMsg = {
      id: `temp-${Date.now()}`,
      fromId, fromName, toId, toName,
      propertyId, propertyTitle, text, replyToId,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [tempMsg, ...prev]);

    try {
      const res  = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ toId, propertyId, text, replyToId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const real = {
        id:            data.message.id,
        fromId:        data.message.fromId,
        fromName:      data.message.from?.name  || fromName,
        toId:          data.message.toId,
        toName:        data.message.to?.name    || toName,
        propertyId:    data.message.propertyId,
        propertyTitle: data.message.property?.title || propertyTitle,
        text:          data.message.text,
        replyToId:     data.message.replyToId,
        createdAt:     data.message.createdAt,
        read:          false,
      };
      // Reemplazar el temp por el real
      setMessages((prev) => prev.map((m) => m.id === tempMsg.id ? real : m));
      return real;
    } catch (err) {
      console.error("sendMessage error:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      return null;
    }
  }, []);

  // ── RESPONDER ──────────────────────────────────────────────────────────────
  const replyMessage = useCallback(async ({ originalMsg, fromId, fromName, text }) => {
    return sendMessage({
      fromId, fromName,
      toId:          originalMsg.fromId,
      toName:        originalMsg.fromName,
      propertyId:    originalMsg.propertyId,
      propertyTitle: originalMsg.propertyTitle,
      text,
      replyToId: originalMsg.id,
    });
  }, [sendMessage]);

  // ── MARCAR LEÍDO ───────────────────────────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
    setUnreadCount((n) => Math.max(0, n - 1));
    try {
      await fetch(`${API_URL}/api/messages/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, []);

  // ── ELIMINAR ───────────────────────────────────────────────────────────────
  const deleteMessage = useCallback(async (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch(`${API_URL}/api/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch (err) {
      console.error("deleteMessage error:", err);
    }
  }, []);

  // ── HELPERS ────────────────────────────────────────────────────────────────
  const getInbox  = useCallback((userId) => messages.filter((m) => m.toId   === userId), [messages]);
  const getSent   = useCallback((userId) => messages.filter((m) => m.fromId === userId), [messages]);
  const getUnreadCount = useCallback((userId) =>
    messages.filter((m) => m.toId === userId && !m.read).length, [messages]);

  const getConversations = useCallback((userId) => {
    const relevant = messages.filter((m) => m.fromId === userId || m.toId === userId);
    const convMap  = {};
    relevant.forEach((m) => {
      const otherId   = m.fromId === userId ? m.toId   : m.fromId;
      const otherName = m.fromId === userId ? m.toName : m.fromName;
      const key = `${[userId, otherId].sort().join("-")}-${m.propertyId}`;
      if (!convMap[key]) {
        convMap[key] = { key, otherId, otherName, propertyId: m.propertyId, propertyTitle: m.propertyTitle, messages: [], unread: 0 };
      }
      convMap[key].messages.push(m);
      if (m.toId === userId && !m.read) convMap[key].unread++;
    });
    return Object.values(convMap).sort(
      (a, b) => new Date(b.messages[0].createdAt) - new Date(a.messages[0].createdAt)
    );
  }, [messages]);

  return (
    <InboxContext.Provider value={{
      messages, loadingMessages, unreadCount,
      fetchMessages, sendMessage, replyMessage,
      markAsRead, deleteMessage,
      getInbox, getSent, getUnreadCount, getConversations,
    }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  return useContext(InboxContext);
}
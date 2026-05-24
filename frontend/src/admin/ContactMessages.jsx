import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get("/contact/messages")
      .then((r) => setMessages(r.data?.messages || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="adm-loading">Loading messages...</div>;

  return (
    <div>
      <h2 className="adm-section-title">Contact Messages</h2>
      <p style={{ fontSize: 13, color: "var(--mid-gray)", marginBottom: 20 }}>
        {messages.length} message{messages.length !== 1 ? "s" : ""} received
      </p>

      {messages.length === 0 ? (
        <div className="cm-empty">📭 No contact messages yet.</div>
      ) : selected ? (
        <MessageDetail msg={selected} onBack={() => setSelected(null)} />
      ) : (
        <div className="cm-table-wrap">
          <table className="cm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Topic</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m, i) => (
                <tr key={i} style={{ cursor: "pointer" }} onClick={() => setSelected(m)}>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td><a href={`mailto:${m.email}`} onClick={e => e.stopPropagation()}>{m.email}</a></td>
                  <td><span className="cm-topic-pill">{m.topic}</span></td>
                  <td>{m.subject}</td>
                  <td><span className="cm-msg-preview">{m.message}</span></td>
                  <td className="cm-date">{new Date(m.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MessageDetail({ msg, onBack }) {
  return (
    <div className="adm-form" style={{ maxWidth: 600 }}>
      <button className="adm-btn adm-btn-secondary" onClick={onBack} style={{ marginBottom: 20 }}>
        ← Back to all messages
      </button>
      <div className="adm-field">
        <label>From</label>
        <p style={{ margin: 0 }}>{msg.name} — <a href={`mailto:${msg.email}`}>{msg.email}</a></p>
      </div>
      <div className="adm-field">
        <label>Topic</label>
        <p style={{ margin: 0 }}><span className="cm-topic-pill">{msg.topic}</span></p>
      </div>
      <div className="adm-field">
        <label>Subject</label>
        <p style={{ margin: 0 }}>{msg.subject}</p>
      </div>
      <div className="adm-field">
        <label>Message</label>
        <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{msg.message}</p>
      </div>
      <div className="adm-field">
        <label>Received</label>
        <p style={{ margin: 0 }}>{new Date(msg.createdAt).toLocaleString()}</p>
      </div>
      <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
        className="adm-btn adm-btn-primary" style={{ display: "inline-block", marginTop: 8, textDecoration: "none" }}>
        ✉️ Reply via Email
      </a>
    </div>
  );
}
